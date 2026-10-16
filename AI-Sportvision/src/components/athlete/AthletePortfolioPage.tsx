import React, { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AssessmentResult } from '../../types';
import jsPDF from 'jspdf';
import { 
  User, 
  ShieldCheck, 
  QrCode, 
  Award, 
  FileText, 
  Download, 
  Share2, 
  MapPin, 
  CheckCircle2,
  Calendar,
  ExternalLink,
  Check
} from 'lucide-react';

interface AthletePortfolioPageProps {
  assessments: AssessmentResult[];
  onProceedToSAIDashboard?: () => void;
}

export const AthletePortfolioPage: React.FC<AthletePortfolioPageProps> = ({ assessments, onProceedToSAIDashboard }) => {
  const { user } = useAuth();
  const [shareCopied, setShareCopied] = useState(false);

  const saiId = user?.saiId || 'SAI-IND-2026-8942';
  const shareText = `${user?.name || 'Athlete'} — SAI Verified Athlete Profile (${saiId}). View AI-verified fitness assessments on SportVision AI.`;

  const handleShareProfile = async () => {
    const shareUrl = `${window.location.origin}/?athlete=${saiId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'SportVision AI Athlete Profile', text: shareText, url: shareUrl });
        return;
      } catch {
        /* user cancelled share sheet — fall through to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  const handleExportDossier = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('SAI Athlete Digital Dossier', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated ${new Date().toLocaleDateString('en-IN')}`, 14, 27);
    doc.line(14, 31, 196, 31);

    doc.setFontSize(14);
    doc.text(user?.name || 'Athlete', 14, 42);
    doc.setFontSize(10);
    doc.text(`SAI ID: ${saiId}`, 14, 49);
    doc.text(`Sport: ${user?.preferredSport || 'Athletics'}`, 14, 55);
    doc.text(`Location: ${user?.district || '—'}, ${user?.state || '—'}`, 14, 61);
    doc.text(`Age: ${user?.age || '—'}  Height: ${user?.height || '—'}cm  Weight: ${user?.weight || '—'}kg`, 14, 67);

    let y = 80;
    doc.setFontSize(12);
    doc.text('Verified Assessment History', 14, y);
    y += 8;
    doc.setFontSize(9);
    assessments.forEach((a) => {
      doc.text(`${a.uploadDate}  |  ${a.testType.replace('_', ' ').toUpperCase()}  |  Score: ${a.talentScore}  |  Authenticity: ${a.authenticityScore}%`, 14, y);
      y += 6;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save(`SAI_Dossier_${(user?.name || 'Athlete').replace(/\s+/g, '_')}.pdf`);
  };

  const handleDownloadDigitalPass = () => {
    const doc = new jsPDF({ format: [90, 140] });
    doc.setFillColor(11, 17, 32);
    doc.rect(0, 0, 90, 140, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('SPORTS AUTHORITY OF INDIA', 8, 12);
    doc.setFontSize(7);
    doc.text('OFFICIAL DIGITAL ATHLETE PASS', 8, 17);
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.rect(8, 22, 74, 74);
    doc.setFillColor(255, 255, 255);
    doc.rect(10, 24, 70, 70, 'F');
    // Simple placeholder QR-style pattern
    doc.setFillColor(15, 23, 42);
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 3 === 0) doc.rect(12 + i * 8.5, 26 + j * 8.5, 6, 6, 'F');
      }
    }
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(user?.name || 'Athlete', 8, 104);
    doc.setFontSize(8);
    doc.text(saiId, 8, 110);
    doc.setFontSize(6.5);
    doc.text(user?.preferredSport || 'Athletics', 8, 116);
    doc.text(`${user?.district || '—'}, ${user?.state || '—'}`, 8, 121);
    doc.setTextColor(74, 222, 128);
    doc.setFontSize(7);
    doc.text('✓ SAI VERIFIED', 8, 130);

    doc.save(`SAI_Digital_Pass_${(user?.name || 'Athlete').replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Action Banner for Workflow */}
      {onProceedToSAIDashboard && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-green-600/15 border border-green-500/30">
          <span className="text-xs font-bold text-green-300">
            ✓ Athlete Portfolio Updated with Verified AI Score & QR Digital Pass
          </span>
          <button
            onClick={onProceedToSAIDashboard}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-green-500/20 flex items-center space-x-2"
          >
            <span>Final Step: View on National SAI Dashboard →</span>
          </button>
        </div>
      )}
      
      {/* LinkedIn Style Profile Header */}
      <div className="relative rounded-3xl glass-card border border-slate-800 overflow-hidden">
        {/* Banner */}
        <div className="h-36 sm:h-48 bg-gradient-to-r from-blue-900 via-slate-900 to-green-900 relative">
          <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-700 text-xs font-bold text-green-400 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>SAI Verified Athlete Profile</span>
          </div>
        </div>

        <div className="px-6 sm:px-8 pb-8 pt-0 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-14 sm:-mt-16 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-blue-600 to-green-500 p-1 shadow-2xl">
              <div className="w-full h-full rounded-3xl bg-slate-900 flex items-center justify-center text-white text-3xl font-black font-['Outfit']">
                {user?.name?.slice(0, 2).toUpperCase() || 'AR'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                  {user?.name || 'Arjun Rathore'}
                </h1>
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-sm text-blue-400 font-semibold">
                {user?.preferredSport || 'Athletics (400m & Long Jump)'} • SAI NCOE Prospect
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>{user?.district || 'Bhiwani'}, {user?.state || 'Haryana'}</span>
                </span>
                <span>•</span>
                <span>Age: {user?.age || 19} Years</span>
                <span>•</span>
                <span>Height: {user?.height || 178} cm</span>
                <span>•</span>
                <span>Weight: {user?.weight || 68} kg</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={handleShareProfile}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 border border-slate-700 flex-1 sm:flex-none justify-center"
            >
              {shareCopied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
              <span>{shareCopied ? 'Link Copied!' : 'Share Profile'}</span>
            </button>
            <button
              onClick={handleExportDossier}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center space-x-2 flex-1 sm:flex-none justify-center"
            >
              <Download className="w-4 h-4" />
              <span>Export CV / Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Portfolio Grid: QR ID Card & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: QR Athlete ID Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl glass-card p-6 border border-slate-800 space-y-6 relative overflow-hidden ai-glow-blue">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  OFFICIAL SAI DIGITAL IDENTIFICATION
                </span>
                <h3 className="text-base font-bold text-white font-['Outfit']">QR Athlete ID Card</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                ACTIVE
              </span>
            </div>

            {/* QR Card Graphic */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex flex-col items-center text-center space-y-4">
              {/* Simulated SVG QR Code */}
              <div className="w-40 h-40 bg-white p-3 rounded-2xl shadow-xl flex items-center justify-center">
                <svg className="w-full h-full text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="5" y="5" width="28" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="12" y="12" width="14" height="14" />
                  <rect x="67" y="5" width="28" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="74" y="12" width="14" height="14" />
                  <rect x="5" y="67" width="28" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="12" y="74" width="14" height="14" />
                  <rect x="42" y="42" width="16" height="16" rx="2" />
                  <rect x="67" y="67" width="14" height="14" />
                  <rect x="40" y="10" width="18" height="10" />
                  <rect x="10" y="40" width="18" height="18" />
                  <rect x="68" y="42" width="20" height="15" />
                </svg>
              </div>

              <div>
                <span className="text-xs font-mono font-bold text-slate-200 block">
                  {user?.saiId || 'SAI-IND-2026-8942'}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  Scan to verify athletic credentials & AI test history
                </span>
              </div>
            </div>

            <button
              onClick={handleDownloadDigitalPass}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-2 border border-slate-700"
            >
              <QrCode className="w-4 h-4 text-blue-400" />
              <span>Download Digital Pass (Wallet Ready)</span>
            </button>
          </div>
        </div>

        {/* Right Side: Assessment History & Certificates */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white font-['Outfit']">
              Verified Assessment Portfolio
            </h3>

            <div className="space-y-3">
              {assessments.map((a) => (
                <div 
                  key={a.id} 
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{a.testType.replace('_', ' ').toUpperCase()}</h4>
                      <span className="text-xs text-slate-400">{a.uploadDate} • Verified by SAI</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-sm font-black text-green-400">{a.talentScore} / 100</span>
                    <span className="text-[10px] text-blue-400 font-semibold">{a.authenticityScore}% Authentic</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
