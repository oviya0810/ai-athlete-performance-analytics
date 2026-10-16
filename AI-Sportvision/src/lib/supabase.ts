import { createClient } from '@supabase/supabase-js';
import { AssessmentResult } from '../types';
import { getSupabaseClient, insertAssessmentToSupabase } from './supabaseService';

export const supabase = getSupabaseClient();

const LOCAL_ASSESSMENTS_KEY = 'sportvision_ai_assessments_v1';

/**
 * Reads stored assessments without injecting mock/demo data.
 */
export function getStoredAssessments(): AssessmentResult[] {
  try {
    const raw = localStorage.getItem(LOCAL_ASSESSMENTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading from localStorage:', e);
  }
  return []; // Clean production initial state with zero mock/demo data
}

/**
 * Stores assessment locally and asynchronously synchronizes to Supabase PostgreSQL database
 */
export function storeAssessment(assessment: AssessmentResult): AssessmentResult[] {
  const current = getStoredAssessments();
  const updated = [assessment, ...current];
  try {
    localStorage.setItem(LOCAL_ASSESSMENTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error storing assessment:', e);
  }

  // Push live assessment data to Supabase database
  insertAssessmentToSupabase(assessment).then((res) => {
    if (res.success) {
      console.log(`[Supabase] Assessment ${assessment.id} synced successfully.`);
    } else {
      console.warn(`[Supabase] Sync pending or table uninitialized: ${res.error}`);
    }
  });

  return updated;
}

export function updateAssessmentStatus(
  id: string,
  status: AssessmentResult['status'],
  verifierName?: string
): AssessmentResult[] {
  const current = getStoredAssessments();
  const updated = current.map(item => {
    if (item.id === id) {
      return {
        ...item,
        status,
        verifiedBy: verifierName || 'SAI National Evaluation Panel',
        verifiedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
      };
    }
    return item;
  });
  try {
    localStorage.setItem(LOCAL_ASSESSMENTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Error saving to localStorage:', e);
  }
  return updated;
}
