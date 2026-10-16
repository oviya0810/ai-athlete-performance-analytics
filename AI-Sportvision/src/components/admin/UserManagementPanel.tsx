import React, { useState, useEffect } from 'react';
import {
  UserCog,
  UserPlus,
  Trash2,
  Copy,
  CheckCircle2,
  Trophy,
  User as UserIcon,
  Shield,
  KeyRound,
  AlertCircle
} from 'lucide-react';
import { listAllAccounts, createAccountByAdmin, deleteAccount } from '../../lib/authStore';
import { addAuditEntry } from '../../lib/auditLog';
import { User } from '../../types';

interface AccountRow {
  userId: string;
  user: User;
}

export const UserManagementPanel: React.FC = () => {
  const [accounts, setAccounts] = useState<AccountRow[]>([]);
  const [newRole, setNewRole] = useState<'athlete' | 'coach'>('athlete');
  const [newName, setNewName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [justCreated, setJustCreated] = useState<{ userId: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => setAccounts(listAllAccounts());

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newName.trim()) {
      setError('Please enter a name for this account.');
      return;
    }
    setIsCreating(true);
    const result = await createAccountByAdmin(newRole, newName.trim());
    setJustCreated({ userId: result.userId, password: result.password });
    addAuditEntry('admin', `Created new ${newRole} account: ${result.userId} (${newName.trim()})`, 'user_management');
    setNewName('');
    setIsCreating(false);
    refresh();
  };

  const handleCopy = () => {
    if (!justCreated) return;
    navigator.clipboard.writeText(`User ID: ${justCreated.userId}\nPassword: ${justCreated.password}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = (userId: string) => {
    if (!confirm(`Remove account "${userId}"? This cannot be undone.`)) return;
    deleteAccount(userId);
    addAuditEntry('admin', `Removed account: ${userId}`, 'user_management');
    refresh();
  };

  const roleIcon = (role: string) => {
    if (role === 'athlete') return <UserIcon className="w-4 h-4 text-green-400" />;
    if (role === 'coach') return <Trophy className="w-4 h-4 text-blue-400" />;
    return <Shield className="w-4 h-4 text-amber-400" />;
  };

  const nonAdminAccounts = accounts.filter((a) => a.user.role !== 'admin');
  const adminAccounts = accounts.filter((a) => a.user.role === 'admin');

  return (
    <div className="space-y-8">
      <div>
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
          Admin Only • Access Control
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 font-['Outfit'] flex items-center gap-2">
          <UserCog className="w-7 h-7 text-amber-400" />
          User Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Athlete and Coach accounts can only be created here by an Admin. There is no public self sign-up.
        </p>
      </div>

      {/* Create new account */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-green-400" />
          Create New Account
        </h2>

        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setNewRole('athlete')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                newRole === 'athlete'
                  ? 'bg-green-600 border-green-500 text-white'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" /> Athlete
            </button>
            <button
              type="button"
              onClick={() => setNewRole('coach')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                newRole === 'coach'
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" /> Coach
            </button>
          </div>

          <div className="flex-1 w-full">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Full name (e.g. Priya Nair)"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isCreating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-green-500 hover:opacity-90 disabled:opacity-60 text-white font-bold text-xs whitespace-nowrap"
          >
            {isCreating ? 'Creating...' : `Create ${newRole === 'athlete' ? 'Athlete' : 'Coach'} ID`}
          </button>
        </form>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center space-x-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {justCreated && (
          <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-green-400 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              Account created — share these credentials
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-slate-300">
                User ID: <span className="font-mono font-bold text-white">{justCreated.userId}</span>
              </span>
              <span className="text-slate-300">
                Password: <span className="font-mono font-bold text-white">{justCreated.password}</span>
              </span>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              This password is shown only once — make sure to note it down before continuing.
            </p>
          </div>
        )}
      </div>

      {/* Existing accounts */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-blue-400" />
          All Accounts ({accounts.length})
        </h2>

        <div className="space-y-2">
          {adminAccounts.map(({ userId, user }) => (
            <div
              key={userId}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-800"
            >
              <div className="flex items-center gap-3">
                {roleIcon(user.role)}
                <div>
                  <div className="text-sm font-bold text-white">{user.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{userId} • ADMIN (master)</div>
                </div>
              </div>
            </div>
          ))}

          {nonAdminAccounts.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">
              No Athlete or Coach accounts yet. Create one above to get started.
            </p>
          ) : (
            nonAdminAccounts.map(({ userId, user }) => (
              <div
                key={userId}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900/70 border border-slate-800"
              >
                <div className="flex items-center gap-3">
                  {roleIcon(user.role)}
                  <div>
                    <div className="text-sm font-bold text-white">{user.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {userId} • {user.role.toUpperCase()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(userId)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400"
                  title="Remove account"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
