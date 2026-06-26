const API_BASE = '/api/gemini';

async function fetchApi(endpoint: string, body: Record<string, unknown>) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || errData.error || 'API Request failed');
    }
    return await res.json();
  } catch (err: any) {
    console.warn(`[Local Mode] API fallback triggered for ${endpoint}`, err);
    const errorMessage = err.message || "API unavailable.";
    
    if (endpoint === '/chat') {
      return { response: `[Demo Mode] ${errorMessage} Connect your Gemini API key to enable live AI planning. Based on your request, start by listing the deadline, available time, and your top priority.` };
    }
    return { response: `[Demo Mode] ${errorMessage}`, priority: "medium", plan: "Mock plan", breakdown: ["Mock step 1", "Mock step 2"] };
  }
}

export const api = {
  chat: (message: string, context?: string) =>
    fetchApi('/chat', { message, context }),

  prioritize: (tasks: unknown[]) =>
    fetchApi('/prioritize', { tasks }),

  plan: (tasks: unknown[]) =>
    fetchApi('/plan', { tasks }),

  breakdown: (task: unknown) =>
    fetchApi('/breakdown', { task }),

  studyPlan: (subject: string, deadline: string, details?: string) =>
    fetchApi('/study-plan', { subject, deadline, details }),

  nextAction: (tasks: unknown[]) =>
    fetchApi('/next-action', { tasks }),
};
