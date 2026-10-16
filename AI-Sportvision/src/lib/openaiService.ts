import { AssessmentResult, FitnessTestType } from '../types';

// Reads API Key from environment variable or localStorage
export const getOpenAIApiKey = (): string => {
  const envKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (envKey) return envKey;
  return localStorage.getItem('sportvision_openai_api_key') || '';
};

export const setOpenAIApiKey = (key: string) => {
  localStorage.setItem('sportvision_openai_api_key', key);
};

export interface AIAnalysisResponse {
  talentScore: number;
  authenticityScore: number;
  movementQualityScore: number;
  metricsBreakdown: {
    strength: number;
    power: number;
    agility: number;
    endurance: number;
    form: number;
  };
  feedback: string[];
}

export async function generateOpenAIAssessmentReport(
  testType: FitnessTestType,
  athleteName: string,
  age: number = 19,
  sport: string = 'Athletics'
): Promise<AIAnalysisResponse | null> {
  const apiKey = getOpenAIApiKey();
  if (!apiKey) {
    return null; // Fallback to local simulated AI calculation
  }

  const prompt = `You are the Sports Authority of India (SAI) Chief AI Biomechanical Evaluator.
Analyze a simulated high-performance assessment video for athlete: "${athleteName}" (Age: ${age}, Primary Discipline: ${sport}) performing standard SAI fitness test: "${testType.toUpperCase()}".

Return ONLY valid JSON in the exact structure below without markdown code fences or extra text:
{
  "talentScore": (integer 80 to 98),
  "authenticityScore": (integer 94 to 99),
  "movementQualityScore": (integer 85 to 97),
  "metricsBreakdown": {
    "strength": (integer 80 to 98),
    "power": (integer 80 to 98),
    "agility": (integer 80 to 98),
    "endurance": (integer 80 to 98),
    "form": (integer 85 to 98)
  },
  "feedback": [
    "Specific biomechanical observation 1 with joint angles or kinematic feedback",
    "Specific biomechanical observation 2 on trunk alignment or cadence",
    "Specific coaching recommendation for SAI NCOE qualification"
  ]
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an AI Sports Biomechanics Expert.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4
      })
    });

    if (!response.ok) {
      console.warn('OpenAI API request failed, falling back to local model:', response.statusText);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    // Clean up markdown block formatting if present
    const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson) as AIAnalysisResponse;
  } catch (err) {
    console.error('Error calling OpenAI API:', err);
    return null;
  }
}
