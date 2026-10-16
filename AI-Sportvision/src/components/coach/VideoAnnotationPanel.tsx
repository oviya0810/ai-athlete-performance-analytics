import React, { useEffect, useRef, useState } from 'react';
import { AssessmentResult } from '../../types';
import { PenTool, Eraser, Save, Trash2, Video } from 'lucide-react';

interface VideoAnnotationPanelProps {
  assessments: AssessmentResult[];
  coachId: string;
}

interface SavedAnnotation {
  id: string;
  assessmentId: string;
  athleteName: string;
  note: string;
  imageDataUrl: string;
  createdAt: string;
}

const storageKey = (coachId: string) => `sportvision_annotations_${coachId}`;

export const VideoAnnotationPanel: React.FC<VideoAnnotationPanelProps> = ({ assessments, coachId }) => {
  const [selectedId, setSelectedId] = useState(assessments[0]?.id || '');
  const [note, setNote] = useState('');
  const [color, setColor] = useState('#22c55e');
  const [saved, setSaved] = useState<SavedAnnotation[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const selected = assessments.find((a) => a.id === selectedId);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(coachId));
      if (raw) setSaved(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [coachId]);

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 360;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
  };

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const ctx = canvasRef.current?.getContext('2d');
    const { x, y } = getPos(e);
    ctx?.beginPath();
    ctx?.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => captureFrame();

  const saveAnnotation = () => {
    const canvas = canvasRef.current;
    if (!canvas || !selected) return;
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.7);
    const entry: SavedAnnotation = {
      id: `ann-${Date.now()}`,
      assessmentId: selected.id,
      athleteName: selected.athleteName,
      note,
      imageDataUrl,
      createdAt: new Date().toLocaleString('en-IN')
    };
    const updated = [entry, ...saved];
    setSaved(updated);
    localStorage.setItem(storageKey(coachId), JSON.stringify(updated));
    setNote('');
  };

  const deleteAnnotation = (id: string) => {
    const updated = saved.filter((a) => a.id !== id);
    setSaved(updated);
    localStorage.setItem(storageKey(coachId), JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
          Coach Tools • Video Annotation Feedback
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit'] flex items-center gap-2">
          <PenTool className="w-7 h-7 text-amber-400" />
          Video Annotation Feedback Tool
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Pause a frame, draw directly on it to point out technique issues, and save the note for your athlete.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
        >
          {assessments.map((a) => (
            <option key={a.id} value={a.id}>{a.athleteName} — {a.testType.replace('_', ' ').toUpperCase()}</option>
          ))}
        </select>

        {selected && (
          <>
            <div className="rounded-2xl overflow-hidden bg-black border border-slate-800 aspect-video relative">
              <video
                ref={videoRef}
                src={selected.videoUrl}
                controls
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button onClick={captureFrame} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5" /> Capture Paused Frame to Annotate
              </button>
              {['#22c55e', '#ef4444', '#3b82f6', '#f59e0b'].map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 ${color === c ? 'border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <button onClick={clearCanvas} className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center gap-1.5">
                <Eraser className="w-3.5 h-3.5" /> Clear Drawing
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black border border-slate-800">
              <canvas
                ref={canvasRef}
                className="w-full cursor-crosshair"
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
              />
            </div>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a written note for the athlete (e.g. 'Keep your elbow tucked in here')"
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
            />
            <button onClick={saveAnnotation} className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-bold flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Feedback
            </button>
          </>
        )}
      </div>

      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">Saved Feedback ({saved.length})</h2>
        {saved.length === 0 ? (
          <p className="text-xs text-slate-500">No annotated feedback saved yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {saved.map((a) => (
              <div key={a.id} className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/70">
                <img src={a.imageDataUrl} alt="Annotated frame" className="w-full aspect-video object-cover" />
                <div className="p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{a.athleteName}</span>
                    <button onClick={() => deleteAnnotation(a.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">{a.note || 'No written note'}</p>
                  <span className="text-[10px] text-slate-600">{a.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
