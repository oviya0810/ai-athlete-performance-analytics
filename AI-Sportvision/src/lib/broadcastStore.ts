const BROADCAST_KEY = 'sportvision_broadcasts';

export interface Broadcast {
  id: string;
  title: string;
  message: string;
  audience: 'all' | 'athletes' | 'coaches';
  postedAt: string;
  postedBy: string;
}

export function getBroadcasts(): Broadcast[] {
  try {
    const raw = localStorage.getItem(BROADCAST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function postBroadcast(title: string, message: string, audience: Broadcast['audience'], postedBy: string): Broadcast {
  const all = getBroadcasts();
  const entry: Broadcast = {
    id: `bc-${Date.now()}`,
    title,
    message,
    audience,
    postedAt: new Date().toLocaleString('en-IN'),
    postedBy
  };
  all.unshift(entry);
  localStorage.setItem(BROADCAST_KEY, JSON.stringify(all.slice(0, 50)));
  return entry;
}

export function deleteBroadcast(id: string): void {
  const all = getBroadcasts().filter((b) => b.id !== id);
  localStorage.setItem(BROADCAST_KEY, JSON.stringify(all));
}
