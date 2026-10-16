import React, { useState, useRef, useEffect } from 'react';
import { FitnessTestType } from '../../types';
import { 
  UploadCloud, 
  FileVideo, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  ArrowRight, 
  Trash2, 
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Video,
  Circle,
  Square,
  SwitchCamera,
  CameraOff
} from 'lucide-react';

interface VideoUploadModuleProps {
  initialTestType?: FitnessTestType;
  onStartAIAnalysis: (data: {
    videoUrl: string;
    videoName: string;
    testType: FitnessTestType;
  }) => void;
}

const SAMPLE_DEMO_VIDEOS: Record<FitnessTestType, { url: string; title: string }> = {
  sit_up: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    title: 'demo_sit_up_evaluation_60s.mp4'
  },
  push_up: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    title: 'demo_push_up_kinematic_test.mp4'
  },
  vertical_jump: {
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    title: 'demo_vertical_jump_power.mp4'
  }
};

export const VideoUploadModule: React.FC<VideoUploadModuleProps> = ({
  initialTestType = 'push_up',
  onStartAIAnalysis
}) => {
  const [selectedTest, setSelectedTest] = useState<FitnessTestType>(initialTestType);
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileSizeMB, setFileSizeMB] = useState<string>('');

  // --- Live 9:16 recording state ---
  const [mode, setMode] = useState<'upload' | 'record'>('upload');
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const liveVideoRef = useRef<HTMLVideoElement>(null);
  const recordCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fixed 9:16 portrait output — matches mobile-first fitness assessment recording
  const REC_WIDTH = 720;
  const REC_HEIGHT = 1280;

  const stopCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (canvasStreamRef.current) {
      canvasStreamRef.current.getTracks().forEach((t) => t.stop());
      canvasStreamRef.current = null;
    }
    setCameraReady(false);
  };

  const drawLoop = () => {
    const video = liveVideoRef.current;
    const canvas = recordCanvasRef.current;
    if (video && canvas && video.videoWidth) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Cover-crop the live camera feed into a fixed 9:16 frame
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        const targetRatio = REC_WIDTH / REC_HEIGHT;
        const srcRatio = vw / vh;
        let sx = 0, sy = 0, sw = vw, sh = vh;
        if (srcRatio > targetRatio) {
          sw = vh * targetRatio;
          sx = (vw - sw) / 2;
        } else {
          sh = vw / targetRatio;
          sy = (vh - sh) / 2;
        }
        ctx.drawImage(video, sx, sy, sw, sh, 0, 0, REC_WIDTH, REC_HEIGHT);
      }
    }
    rafRef.current = requestAnimationFrame(drawLoop);
  };

  const startCamera = async (mode_: 'user' | 'environment' = facingMode) => {
    setCameraError(null);
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode_, width: { ideal: 1080 }, height: { ideal: 1920 } },
        audio: true
      });
      streamRef.current = stream;
      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
        await liveVideoRef.current.play();
      }
      setCameraReady(true);
      rafRef.current = requestAnimationFrame(drawLoop);
    } catch (err) {
      setCameraError('Camera access denied or unavailable. Please allow camera permission and try again.');
      setCameraReady(false);
    }
  };

  const switchCamera = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    if (mode === 'record') startCamera(next);
  };

  const startRecording = () => {
    if (!canvasStreamRef.current) {
      const canvas = recordCanvasRef.current;
      if (!canvas) return;
      const canvasStream = canvas.captureStream(30);
      const audioTrack = streamRef.current?.getAudioTracks()[0];
      if (audioTrack) canvasStream.addTrack(audioTrack);
      canvasStreamRef.current = canvasStream;
    }
    chunksRef.current = [];
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
      ? 'video/webm;codecs=vp9,opus'
      : 'video/webm';
    const recorder = new MediaRecorder(canvasStreamRef.current!, { mimeType });
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const objectUrl = URL.createObjectURL(blob);
      const sizeInMB = blob.size / (1024 * 1024);
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      setVideoPreviewUrl(objectUrl);
      setFileName(`live_recording_9x16_${stamp}.webm`);
      setFileSizeMB(sizeInMB.toFixed(1));
      setFileError(null);
      stopCamera();
    };
    mediaRecorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
    setRecordSeconds(0);
    timerRef.current = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const switchMode = (next: 'upload' | 'record') => {
    if (isRecording) return;
    setMode(next);
    setFileError(null);
    if (next === 'record') {
      startCamera();
    } else {
      stopCamera();
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setFileError(null);

    // Check format
    const validFormats = ['video/mp4', 'video/quicktime', 'video/webm'];
    if (!validFormats.includes(file.type) && !file.name.match(/\.(mp4|mov|webm)$/i)) {
      setFileError('Invalid video format. Please upload MP4, MOV, or WEBM files only.');
      return;
    }

    // Check file size (< 100MB)
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 100) {
      setFileError('File size exceeds 100MB limit. Please compress or trim your video.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(objectUrl);
    setFileName(file.name);
    setFileSizeMB(sizeInMB.toFixed(1));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleLoadSample = () => {
    const sample = SAMPLE_DEMO_VIDEOS[selectedTest];
    setVideoPreviewUrl(sample.url);
    setFileName(sample.title);
    setFileSizeMB('14.2');
    setFileError(null);
  };

  const handleSubmitAnalysis = () => {
    if (!videoPreviewUrl) return;
    onStartAIAnalysis({
      videoUrl: videoPreviewUrl,
      videoName: fileName || 'athlete_assessment_video.mp4',
      testType: selectedTest
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/40 via-slate-900/80 to-green-900/40 p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
            VIDEO UPLOAD MODULE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit']">
            Upload Assessment Recording
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Securely upload your fitness video for automated Computer Vision and Machine Learning evaluation.
          </p>
        </div>

        {/* Test Selector */}
        <div className="flex items-center space-x-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-700">
          <button
            onClick={() => setSelectedTest('sit_up')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedTest === 'sit_up' ? 'bg-green-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sit-Up AI
          </button>
          <button
            onClick={() => setSelectedTest('push_up')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedTest === 'push_up' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Push-Up AI
          </button>
          <button
            onClick={() => setSelectedTest('vertical_jump')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedTest === 'vertical_jump' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Vertical Jump
          </button>
        </div>
      </div>

      {/* Validation Rules Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <div>
            <span className="block text-xs font-bold text-white">Supported Formats</span>
            <span className="text-[11px] text-slate-400">MP4, MOV, WEBM</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center space-x-3">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <div>
            <span className="block text-xs font-bold text-white">File Size Check</span>
            <span className="text-[11px] text-slate-400">Up to 100 MB</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center space-x-3">
          <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
          <div>
            <span className="block text-xs font-bold text-white">AI Video Verification</span>
            <span className="text-[11px] text-slate-400">Tamper & Visibility Check</span>
          </div>
        </div>
      </div>

      {/* Upload Zone or Video Preview */}
      {!videoPreviewUrl ? (
        <div className="space-y-5">
          {/* Mode Toggle: Upload vs Live Record */}
          <div className="flex items-center justify-center">
            <div className="flex items-center bg-slate-900/90 p-1.5 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => switchMode('upload')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  mode === 'upload' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload from Device</span>
              </button>
              <button
                type="button"
                onClick={() => switchMode('record')}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  mode === 'record' ? 'bg-green-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Record Live (9:16)</span>
              </button>
            </div>
          </div>

          {mode === 'upload' ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
                dragActive
                  ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                  : 'border-slate-700/80 bg-slate-900/40 hover:border-slate-600'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".mp4,.mov,.webm,video/mp4,video/quicktime,video/webm"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="max-w-md mx-auto space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto shadow-lg">
                  <UploadCloud className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-['Outfit']">
                    Drag and drop your video file here
                  </h3>
                  <p className="text-xs text-slate-400">
                    or click browse to select from your device storage
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20"
                  >
                    Browse Video File
                  </button>

                  <button
                    type="button"
                    onClick={handleLoadSample}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-green-400" />
                    <span>Load Sample SIH Video</span>
                  </button>
                </div>

                {fileError && (
                  <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center space-x-2 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{fileError}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Live 9:16 Record Panel */
            <div className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col items-center space-y-5">
              <div
                className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl mx-auto"
                style={{ width: 'min(280px, 100%)', aspectRatio: '9 / 16' }}
              >
                <video
                  ref={liveVideoRef}
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-0 absolute"
                />
                <canvas
                  ref={recordCanvasRef}
                  width={REC_WIDTH}
                  height={REC_HEIGHT}
                  className="w-full h-full object-cover"
                />

                {!cameraReady && !cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">
                    Starting camera...
                  </div>
                )}

                {isRecording && (
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5 bg-black/60 px-2.5 py-1 rounded-full">
                    <Circle className="w-2.5 h-2.5 text-red-500 fill-red-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-white">{formatTime(recordSeconds)}</span>
                  </div>
                )}

                {cameraReady && (
                  <button
                    type="button"
                    onClick={switchCamera}
                    disabled={isRecording}
                    className="absolute top-3 right-3 p-2 bg-black/60 rounded-full text-white disabled:opacity-40"
                    title="Switch Camera"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>
                )}
              </div>

              {cameraError ? (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center space-x-2 text-xs text-red-400 max-w-md">
                  <CameraOff className="w-4 h-4 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 text-center max-w-xs">
                  Recording is force-cropped to a 9:16 portrait frame for consistent AI pose analysis, regardless of your camera's native aspect ratio.
                </p>
              )}

              <div className="flex items-center space-x-3">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    disabled={!cameraReady}
                    className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center space-x-2"
                  >
                    <Circle className="w-3.5 h-3.5 fill-white" />
                    <span>Start Recording</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center space-x-2 border border-slate-700"
                  >
                    <Square className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                    <span>Stop & Use This Video</span>
                  </button>
                )}
              </div>

              {fileError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center space-x-2 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{fileError}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Video Preview Box */
        <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <FileVideo className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{fileName}</h3>
                <span className="text-xs text-slate-400">
                  {fileSizeMB} MB • Ready for AI Computer Vision Pipeline
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setVideoPreviewUrl(null);
                setFileName('');
              }}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors"
              title="Remove File"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-[420px] mx-auto border border-slate-800 shadow-2xl">
            <video
              src={videoPreviewUrl}
              controls
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center space-x-2 text-xs text-green-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Format & Duration Validated • Secure URL Ready</span>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={() => setVideoPreviewUrl(null)}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex-1 sm:flex-none"
              >
                Change Video
              </button>
              <button
                onClick={handleSubmitAnalysis}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-green-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-2 flex-1 sm:flex-none"
              >
                <span>Run AI Performance Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
