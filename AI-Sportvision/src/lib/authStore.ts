import { User } from '../types';

/**
 * Lightweight client-side credential store.
 *
 * This project has no dedicated auth backend (Supabase is used only as an
 * optional data sync layer for assessments/profiles), so real Sign In /
 * Sign Up verification is implemented here using the browser's
 * localStorage + the Web Crypto API (SHA-256) for password hashing.
 *
 * NOTE: This is enough for an academic / demo SIH project. It is NOT a
 * substitute for a real server-side authentication system (passwords never
 * leave the browser, so this only protects against casual/local misuse,
 * not a determined attacker with access to localStorage).
 */

const CREDENTIALS_KEY = 'sportvision_credentials';

interface StoredCredential {
  email: string;
  passwordHash: string;
  user: User;
}

const getAllCredentials = (): Record<string, StoredCredential> => {
  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveAllCredentials = (data: Record<string, StoredCredential>) => {
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(data));
};

const normalizeEmail = (userId: string) => userId.trim().toLowerCase();

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export type AuthStoreError =
  | 'EMAIL_ALREADY_REGISTERED'
  | 'EMAIL_NOT_FOUND'
  | 'INCORRECT_PASSWORD';

/**
 * Registers a brand-new account. Fails if the email is already taken.
 */
export async function registerAccount(
  email: string,
  password: string,
  user: User
): Promise<{ success: true } | { success: false; error: AuthStoreError }> {
  const key = normalizeEmail(email);
  const all = getAllCredentials();

  if (all[key]) {
    return { success: false, error: 'EMAIL_ALREADY_REGISTERED' };
  }

  const passwordHash = await hashPassword(password);
  all[key] = { email: key, passwordHash, user };
  saveAllCredentials(all);
  return { success: true };
}

/**
 * Verifies email + password against the stored credential and, on success,
 * returns the full previously-registered user profile.
 */
export async function verifyLogin(
  email: string,
  password: string
): Promise<{ success: true; user: User } | { success: false; error: AuthStoreError }> {
  const key = normalizeEmail(email);
  const all = getAllCredentials();
  const record = all[key];

  if (!record) {
    return { success: false, error: 'EMAIL_NOT_FOUND' };
  }

  const passwordHash = await hashPassword(password);
  if (passwordHash !== record.passwordHash) {
    return { success: false, error: 'INCORRECT_PASSWORD' };
  }

  return { success: true, user: record.user };
}

export function isEmailRegistered(email: string): boolean {
  const all = getAllCredentials();
  return !!all[normalizeEmail(email)];
}

/**
 * Generates the next sequential User ID for a role, e.g. athlete001,
 * athlete002, coach001, admin002 — used by the Admin "Create User" panel
 * so IDs are short, predictable, and collision-free.
 */
export function generateNextUserId(role: 'athlete' | 'coach' | 'admin'): string {
  const all = getAllCredentials();
  const existingOfRole = Object.values(all).filter((c) => c.user.role === role);
  const next = existingOfRole.length + 1;
  let candidate = `${role}${String(next).padStart(3, '0')}`;
  // Guard against gaps left by deleted accounts causing a collision.
  let bump = next;
  while (all[normalizeEmail(candidate)]) {
    bump += 1;
    candidate = `${role}${String(bump).padStart(3, '0')}`;
  }
  return candidate;
}

/**
 * Ensures exactly one master Admin account exists so the platform is never
 * locked out. Only ever creates it if NO admin account is present yet —
 * it will never overwrite an admin that was already created/edited.
 */
export async function seedMasterAdminIfNeeded(): Promise<void> {
  const all = getAllCredentials();
  const hasAdmin = Object.values(all).some((c) => c.user.role === 'admin');
  if (hasAdmin) return;

  const masterId = 'admin001';
  const passwordHash = await hashPassword('Admin@2026');
  all[normalizeEmail(masterId)] = {
    email: normalizeEmail(masterId),
    passwordHash,
    user: {
      id: 'sai-admin-master',
      name: 'System Administrator',
      email: masterId,
      role: 'admin'
    } as User
  };
  saveAllCredentials(all);
}

/**
 * Wipes all locally-stored accounts, sessions, and history — used once to
 * clear legacy demo data left over from earlier builds of this app.
 */
export function clearAllAuthAndHistory(): void {
  localStorage.removeItem(CREDENTIALS_KEY);
  localStorage.removeItem('sportvision_current_user');
  localStorage.removeItem('sportvision_athlete_profile');
  localStorage.removeItem('sportvision_ai_assessments_v1');
}

/** Returns every account currently in the store, for the Admin user-management table. */
export function listAllAccounts(): { userId: string; user: User }[] {
  const all = getAllCredentials();
  return Object.values(all).map((c) => ({ userId: c.email, user: c.user }));
}

/** Permanently removes an account (used by Admin to deactivate/remove a user). */
export function deleteAccount(userId: string): void {
  const all = getAllCredentials();
  delete all[normalizeEmail(userId)];
  saveAllCredentials(all);
}

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

/**
 * Admin-only account creation. Auto-generates a sequential User ID
 * (athlete001, coach002, ...) and a random temporary password, and stores
 * the new account. Returns the credentials so the Admin can hand them to
 * the athlete/coach.
 */
export async function createAccountByAdmin(
  role: 'athlete' | 'coach',
  name: string
): Promise<{ userId: string; password: string; user: User }> {
  const userId = generateNextUserId(role);
  const password = generateTempPassword();

  const user: User = {
    id: `sai-${role}-${Date.now()}`,
    name,
    email: userId,
    role
  } as User;

  const passwordHash = await hashPassword(password);
  const all = getAllCredentials();
  all[normalizeEmail(userId)] = { email: normalizeEmail(userId), passwordHash, user };
  saveAllCredentials(all);

  return { userId, password, user };
}
