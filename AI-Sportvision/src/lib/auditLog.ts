const AUDIT_KEY = 'sportvision_audit_log';

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string; // e.g. "admin001" or "System"
  action: string; // short description
  category: 'auth' | 'user_management' | 'verification' | 'broadcast' | 'system';
}

export function addAuditEntry(actor: string, action: string, category: AuditEntry['category']): void {
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    const all: AuditEntry[] = raw ? JSON.parse(raw) : [];
    all.unshift({
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toLocaleString('en-IN'),
      actor,
      action,
      category
    });
    localStorage.setItem(AUDIT_KEY, JSON.stringify(all.slice(0, 200)));
  } catch {
    /* localStorage unavailable — no-op */
  }
}

export function getAuditLog(): AuditEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearAuditLog(): void {
  localStorage.removeItem(AUDIT_KEY);
}
