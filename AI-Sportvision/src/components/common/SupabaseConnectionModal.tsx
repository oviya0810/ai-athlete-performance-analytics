import React, { useState } from 'react';
import { Database, Key, CheckCircle2, AlertCircle, Copy, Check, RefreshCw, Server } from 'lucide-react';
import { SUPABASE_SQL_SCHEMA, fetchAssessmentsFromSupabase, getSupabaseCredentials } from '../../lib/supabaseService';
import { AssessmentResult } from '../../types';

interface SupabaseConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataSynced?: (assessments: AssessmentResult[]) => void;
}

export const SupabaseConnectionModal: React.FC<SupabaseConnectionModalProps> = ({
  isOpen,
  onClose,
  onDataSynced
}) => {
  const credentials = getSupabaseCredentials();
  const [supabaseUrl, setSupabaseUrl] = useState(credentials.url);
  const [supabaseKey, setSupabaseKey] = useState(credentials.anonKey);
  const [copied, setCopied] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const handleSaveCredentials = () => {
    localStorage.setItem('sportvision_supabase_url', supabaseUrl.trim());
    localStorage.setItem('sportvision_supabase_anon_key', supabaseKey.trim());
    setStatusMsg({ text: 'Supabase credentials saved successfully!', type: 'success' });
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestAndPullData = async () => {
    setIsSyncing(true);
    setStatusMsg({ text: 'Connecting to Supabase PostgreSQL database...', type: 'info' });
    try {
      const liveData = await fetchAssessmentsFromSupabase();
      if (liveData.length > 0 && onDataSynced) {
        onDataSynced(liveData);
        localStorage.setItem('sportvision_ai_assessments_v1', JSON.stringify(liveData));
      }
      setStatusMsg({
        text: `Successfully connected! Fetched ${liveData.length} records from public.assessments table.`,
        type: 'success'
      });
    } catch (err: any) {
      setStatusMsg({
        text: `Failed to connect: ${err?.message || 'Check your Supabase URL & Key'}`,
        type: 'error'
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-card max-w-2xl w-full rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white font-['Outfit']">Supabase Database Connect & Access</h2>
              <p className="text-xs text-slate-400">Connect live PostgreSQL database & remove all demo data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm font-bold px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800"
          >
            Close ✕
          </button>
        </div>

        {statusMsg && (
          <div
            className={`p-4 rounded-2xl border text-xs flex items-center space-x-2 ${
              statusMsg.type === 'success'
                ? 'bg-green-500/15 border-green-500/30 text-green-300'
                : statusMsg.type === 'error'
                ? 'bg-red-500/15 border-red-500/30 text-red-300'
                : 'bg-blue-500/15 border-blue-500/30 text-blue-300'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Supabase Project URL</label>
            <input
              type="text"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              placeholder="https://yourproject.supabase.co"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Supabase Anon Key</label>
            <input
              type="password"
              value={supabaseKey}
              onChange={(e) => setSupabaseKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleSaveCredentials}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20"
            >
              Save Credentials
            </button>
            <button
              onClick={handleTestAndPullData}
              disabled={isSyncing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 hover:opacity-95 text-white text-xs font-bold flex items-center space-x-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Test Connection & Access Supabase Data'}</span>
            </button>
          </div>
        </div>

        {/* SQL Schema Ready-to-Paste Block */}
        <div className="space-y-2 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">1. Run this SQL in your Supabase SQL Editor:</span>
            <button
              onClick={handleCopySQL}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48">
            {SUPABASE_SQL_SCHEMA}
          </pre>
        </div>
      </div>
    </div>
  );
};
