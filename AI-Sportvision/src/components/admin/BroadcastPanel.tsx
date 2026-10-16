import React, { useEffect, useState } from 'react';
import { getBroadcasts, postBroadcast, deleteBroadcast, Broadcast } from '../../lib/broadcastStore';
import { addAuditEntry } from '../../lib/auditLog';
import { Megaphone, Send, Trash2, Users } from 'lucide-react';

interface BroadcastPanelProps {
  postedBy: string;
}

const audienceStyle: Record<string, string> = {
  all: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  athletes: 'bg-green-500/15 text-green-400 border-green-500/30',
  coaches: 'bg-amber-500/15 text-amber-400 border-amber-500/30'
};

export const BroadcastPanel: React.FC<BroadcastPanelProps> = ({ postedBy }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<Broadcast['audience']>('all');
  const [items, setItems] = useState<Broadcast[]>([]);

  useEffect(() => setItems(getBroadcasts()), []);

  const handlePost = () => {
    if (!title.trim() || !message.trim()) return;
    postBroadcast(title.trim(), message.trim(), audience, postedBy);
    addAuditEntry(postedBy, `Posted announcement: "${title.trim()}"`, 'broadcast');
    setItems(getBroadcasts());
    setTitle('');
    setMessage('');
  };

  const handleDelete = (id: string) => {
    deleteBroadcast(id);
    setItems(getBroadcasts());
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-blue-400 border border-blue-500/30">
          Admin Tools • Broadcast Announcements
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit'] flex items-center gap-2">
          <Megaphone className="w-7 h-7 text-blue-400" />
          Broadcast Announcements
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Send a single announcement out to all athletes, all coaches, or everyone on the platform.
        </p>
      </div>

      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Announcement title"
          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Announcement message..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
        />
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            {(['all', 'athletes', 'coaches'] as const).map((a) => (
              <button
                key={a}
                onClick={() => setAudience(a)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border capitalize ${
                  audience === a ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <button onClick={handlePost} className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5" /> Post Announcement
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 border border-slate-800 text-center text-sm text-slate-400">
            No announcements posted yet.
          </div>
        ) : (
          items.map((b) => (
            <div key={b.id} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{b.title}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize flex items-center gap-1 ${audienceStyle[b.audience]}`}>
                    <Users className="w-3 h-3" /> {b.audience}
                  </span>
                  <button onClick={() => handleDelete(b.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-300">{b.message}</p>
              <span className="text-[10px] text-slate-500">Posted by {b.postedBy} • {b.postedAt}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
