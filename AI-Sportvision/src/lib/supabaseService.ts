import { createClient } from '@supabase/supabase-js';
import { AssessmentResult } from '../types';

// Load Supabase URL & Key from Environment or LocalStorage Override
export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const customUrl = localStorage.getItem('sportvision_supabase_url');
  const customKey = localStorage.getItem('sportvision_supabase_anon_key');

  const envUrl =
    (import.meta as any).env?.VITE_SUPABASE_URL ||
    (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL ||
    '';
  const envKey =
    (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY ||
    (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
    (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  return {
    url: customUrl || envUrl || 'https://qfdzwpxbwtsoyfgidhys.supabase.co',
    anonKey: customKey || envKey || 'sb_publishable_c3Lx8KxdAQOvDnPpjWnYfQ_jIixHtLR'
  };
}

export function getSupabaseClient() {
  const { url, anonKey } = getSupabaseCredentials();
  return createClient(url, anonKey);
}

// SQL Schema for creating the assessments and profiles tables in Supabase
export const SUPABASE_SQL_SCHEMA = `-- 1. Run this in your Supabase SQL Editor to create the assessments table:
CREATE TABLE IF NOT EXISTS public.assessments (
  id TEXT PRIMARY KEY,
  athlete_id TEXT NOT NULL,
  athlete_name TEXT NOT NULL,
  athlete_district TEXT,
  athlete_state TEXT,
  test_type TEXT NOT NULL,
  video_url TEXT,
  video_name TEXT,
  upload_date TEXT,
  status TEXT DEFAULT 'pending_verification',
  talent_score INTEGER DEFAULT 0,
  authenticity_score INTEGER DEFAULT 98,
  movement_quality_score INTEGER DEFAULT 95,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read and insert" ON public.assessments
  FOR ALL USING (true) WITH CHECK (true);

-- 2. Run this to create the profiles table for Login & Registration:
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  height INTEGER,
  weight INTEGER,
  district TEXT,
  state TEXT,
  preferred_sport TEXT,
  academy_name TEXT,
  specialization TEXT,
  license_id TEXT,
  official_id TEXT,
  sai_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read and insert profiles" ON public.profiles
  FOR ALL USING (true) WITH CHECK (true);
`;

/**
 * Fetch assessments from Supabase PostgreSQL database
 */
export async function fetchAssessmentsFromSupabase(): Promise<AssessmentResult[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch notice:', error.message);
      return [];
    }

    if (!data || data.length === 0) return [];

    return data.map((row: any) => ({
      id: row.id,
      athleteId: row.athlete_id || 'sai-ath-101',
      athleteName: row.athlete_name || 'Arjun Rathore',
      athleteDistrict: row.athlete_district || 'Bhiwani',
      athleteState: row.athlete_state || 'Haryana',
      testType: row.test_type || 'push_up',
      videoUrl: row.video_url || '',
      videoName: row.video_name || '',
      uploadDate: row.upload_date || new Date().toISOString().slice(0, 10),
      status: row.status || 'pending_verification',
      talentScore: row.talent_score || 90,
      authenticityScore: row.authenticity_score || 98,
      movementQualityScore: row.movement_quality_score || 95,
      ...((row.payload as any) || {})
    }));
  } catch (err) {
    console.warn('Supabase fetch failed:', err);
    return [];
  }
}

/**
 * Insert a new assessment into Supabase PostgreSQL database
 */
export async function insertAssessmentToSupabase(assessment: AssessmentResult): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('assessments')
      .upsert([
        {
          id: assessment.id,
          athlete_id: assessment.athleteId,
          athlete_name: assessment.athleteName,
          athlete_district: assessment.athleteDistrict,
          athlete_state: assessment.athleteState,
          test_type: assessment.testType,
          video_url: assessment.videoUrl,
          video_name: assessment.videoName,
          upload_date: assessment.uploadDate,
          status: assessment.status,
          talent_score: assessment.talentScore,
          authenticity_score: assessment.authenticityScore,
          movement_quality_score: assessment.movementQualityScore,
          payload: {
            sitUpData: assessment.sitUpData,
            pushUpData: assessment.pushUpData,
            verticalJumpData: assessment.verticalJumpData,
            metricsBreakdown: assessment.metricsBreakdown,
            feedback: assessment.feedback
          }
        }
      ]);

    if (error) {
      console.warn('Supabase insert notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

/**
 * Save / Update Login and Register user profile in Supabase database table `profiles`
 */
export async function upsertUserProfileToSupabase(user: any): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from('profiles')
      .upsert([
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          age: user.age || null,
          gender: user.gender || null,
          height: user.height || null,
          weight: user.weight || null,
          district: user.district || null,
          state: user.state || null,
          preferred_sport: user.preferredSport || null,
          academy_name: user.academyName || null,
          specialization: user.specialization || null,
          license_id: user.licenseId || null,
          official_id: user.officialId || null,
          sai_id: user.saiId || null,
          last_login_at: new Date().toISOString()
        }
      ], { onConflict: 'email' });

    if (error) {
      console.warn('Supabase profile upsert error:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

/**
 * Fetch a registered user profile by email from Supabase database
 */
export async function fetchUserProfileFromSupabase(email: string): Promise<any | null> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      age: data.age,
      gender: data.gender,
      height: data.height,
      weight: data.weight,
      district: data.district,
      state: data.state,
      preferredSport: data.preferred_sport,
      academyName: data.academy_name,
      specialization: data.specialization,
      licenseId: data.license_id,
      officialId: data.official_id,
      saiId: data.sai_id
    };
  } catch (err) {
    return null;
  }
}

