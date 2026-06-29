import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = Router();

let aiClient: GoogleGenAI | null = null;
try {
  let key = process.env.GEMINI_API_KEY;
  if (key) {
    key = key.trim();
    key = key.replace(/^["']|["']$/g, '');
    key = key.replace(/^Bearer\s+/i, '');

    aiClient = new GoogleGenAI({ apiKey: key });
  }
} catch (e: any) {
  console.error('Failed to initialize Gemini client:', e.name, e.message);
  aiClient = null;
}

export const isGeminiInitialized = !!aiClient;

function getModel() {
  if (!aiClient) {
    throw new Error('API key not configured');
  }
  return aiClient;
}

function handleGeminiError(error: any, res: Response) {
  const msg = error.message || '';
  console.error('[Gemini API Error]', msg);

  if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('unavailable')) {
    return res.status(503).json({ 
      error: 'GEMINI_UNAVAILABLE', 
      message: 'Gemini is currently experiencing high demand. Please try again in a few moments.' 
    });
  }
  if (msg.includes('API key not configured') || msg.includes('API_KEY_INVALID') || msg.includes('ACCESS_TOKEN_TYPE_UNSUPPORTED')) {
    return res.status(401).json({ error: 'GEMINI_KEY_MISSING', message: 'AI connection needs configuration. Please try again later.' });
  }
  if (msg.includes('403') || msg.includes('callers without established identity') || msg.includes('permission')) {
    return res.status(403).json({ error: 'GEMINI_AUTH_ERROR', message: 'AI connection needs configuration. Please try again later.' });
  }
  if (msg.includes('404') || msg.includes('unsupported') || msg.includes('not found')) {
    return res.status(404).json({ error: 'GEMINI_MODEL_UNAVAILABLE', message: 'AI connection needs configuration. Please try again later.' });
  }

  return res.status(500).json({ error: 'GEMINI_SERVER_ERROR', message: 'AI connection needs configuration. Please try again later.' });
}

async function generateWithRetry(modelName: string, prompt: string, maxRetries = 3) {
  const ai = getModel();
  let delay = 1000;
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await ai.models.generateContent({
        model: modelName,
        contents: prompt
      });
      return result.text;
    } catch (error: any) {
      lastError = error;
      const msg = error.message || '';
      
      if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('unavailable')) {
        if (attempt < maxRetries) {
          console.warn(`[Gemini API] 503 Unavailable. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }
      }
      throw error;
    }
  }
  throw lastError;
}

// ------------------------------------
// Helpers
// ------------------------------------

interface TaskInput {
  title: string;
  deadline?: string | null;
  priority?: string;
  estimated_duration?: number | null;
  progress?: number;
  status?: string;
  description?: string | null;
}

function formatTasksForPrompt(tasks: TaskInput[]): string {
  return tasks
    .map((t, i) => {
      const parts = [`${i + 1}. "${t.title}"`];
      if (t.deadline) parts.push(`Deadline: ${t.deadline}`);
      if (t.priority) parts.push(`Priority: ${t.priority}`);
      if (t.estimated_duration) parts.push(`Est. duration: ${t.estimated_duration} min`);
      if (t.progress !== undefined) parts.push(`Progress: ${t.progress}%`);
      if (t.status) parts.push(`Status: ${t.status}`);
      return parts.join(' | ');
    })
    .join('\n');
}

// ------------------------------------
// POST /api/gemini/chat
// ------------------------------------

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Missing required field: message' });
      return;
    }

    const systemInstruction =
      'You are DeadlineAI, a productivity assistant. You help students, professionals, and entrepreneurs manage deadlines, plan their work, break down projects, create study plans, and stay focused. Be concise, practical, and action-oriented. Use bullet points and clear structure. Keep responses under 500 words.';

    let fullPrompt = `${systemInstruction}\n\n`;
    if (context) {
      fullPrompt += `Context:\n${context}\n\n`;
    }
    fullPrompt += `User: ${message}`;

    const response = await generateWithRetry('gemini-2.5-flash', fullPrompt);

    res.json({ response });
  } catch (error: any) {
    handleGeminiError(error, res);
  }
});

// ------------------------------------
// POST /api/gemini/prioritize
// ------------------------------------

router.post('/prioritize', async (req: Request, res: Response) => {
  try {
    const { tasks } = req.body;

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      res.status(400).json({ error: 'Missing required field: tasks (non-empty array)' });
      return;
    }

    const prompt = `You are a productivity expert. Analyze these tasks and provide a prioritized numbered list. Consider deadlines (urgency), priority levels, estimated duration, current progress, and status. For each task, give a brief reasoning (1 sentence) for its position.

Tasks:
${formatTasksForPrompt(tasks)}

Respond with a clear numbered priority list. Most urgent/important first.`;

    const response = await generateWithRetry('gemini-2.5-flash', prompt);

    res.json({ response });
  } catch (error: any) {
    handleGeminiError(error, res);
  }
});

// ------------------------------------
// POST /api/gemini/plan
// ------------------------------------

router.post('/plan', async (req: Request, res: Response) => {
  try {
    const { tasks } = req.body;

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      res.status(400).json({ error: 'Missing required field: tasks (non-empty array)' });
      return;
    }

    const prompt = `You are a productivity expert and scheduling assistant. Create a practical daily schedule using these tasks. Consider their deadlines, priorities, estimated durations, and current progress. Include break times and be realistic about focus periods.

Tasks:
${formatTasksForPrompt(tasks)}

Create a structured daily plan with time blocks. Use a format like:
- 9:00 AM - 10:30 AM: [Task] (reason)
Include tips for maintaining focus and energy throughout the day.`;

    const response = await generateWithRetry('gemini-2.5-flash', prompt);

    res.json({ response });
  } catch (error: any) {
    handleGeminiError(error, res);
  }
});

// ------------------------------------
// POST /api/gemini/breakdown
// ------------------------------------

router.post('/breakdown', async (req: Request, res: Response) => {
  try {
    const { task } = req.body;

    if (!task || !task.title) {
      res.status(400).json({ error: 'Missing required field: task with title' });
      return;
    }

    const taskDetails = [
      `Title: "${task.title}"`,
      task.description ? `Description: ${task.description}` : null,
      task.deadline ? `Deadline: ${task.deadline}` : null,
      task.estimated_duration ? `Total estimated duration: ${task.estimated_duration} minutes` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const prompt = `You are a project management expert. Break down this task/project into smaller, actionable steps. Each step should be specific, measurable, and have a time estimate.

Task Details:
${taskDetails}

Provide a numbered list of sub-tasks/steps with:
1. Clear action item
2. Estimated time to complete
3. Any dependencies on other steps

Keep each step small enough to complete in one focused session (under 2 hours). Be practical and specific.`;

    const response = await generateWithRetry('gemini-2.5-flash', prompt);

    res.json({ response });
  } catch (error: any) {
    handleGeminiError(error, res);
  }
});

// ------------------------------------
// POST /api/gemini/study-plan
// ------------------------------------

router.post('/study-plan', async (req: Request, res: Response) => {
  try {
    const { subject, deadline, details } = req.body;

    if (!subject || typeof subject !== 'string') {
      res.status(400).json({ error: 'Missing required field: subject' });
      return;
    }

    if (!deadline || typeof deadline !== 'string') {
      res.status(400).json({ error: 'Missing required field: deadline' });
      return;
    }

    let prompt = `You are an expert study coach. Create a comprehensive study plan for the following:

Subject: ${subject}
Deadline: ${deadline}`;

    if (details) {
      prompt += `\nAdditional details: ${details}`;
    }

    prompt += `

Create a structured study plan that includes:
1. Topics/chapters to cover (broken into daily sessions)
2. Time allocation for each topic
3. Review and practice sessions
4. Breaks and rest periods
5. Tips for effective studying of this subject
6. Recommended study techniques (active recall, spaced repetition, etc.)

Be specific with dates/days and time blocks. Make it realistic and achievable.`;

    const response = await generateWithRetry('gemini-2.5-flash', prompt);

    res.json({ response });
  } catch (error: any) {
    handleGeminiError(error, res);
  }
});

// ------------------------------------
// POST /api/gemini/next-action
// ------------------------------------

router.post('/next-action', async (req: Request, res: Response) => {
  try {
    const { tasks } = req.body;

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      res.status(400).json({ error: 'Missing required field: tasks (non-empty array)' });
      return;
    }

    const prompt = `You are a productivity coach. Based on the following tasks, suggest the SINGLE most important next action the user should take right now. Consider urgency (deadlines), importance (priority), effort required, and current progress.

Tasks:
${formatTasksForPrompt(tasks)}

Respond with:
1. **Next Action**: The single most important thing to do right now (be very specific)
2. **Why**: Brief reasoning (2-3 sentences max) explaining why this is the top priority
3. **Time needed**: How long this action should take
4. **Tip**: One practical tip for getting started immediately`;

    const response = await generateWithRetry('gemini-2.5-flash', prompt);

    res.json({ response });
  } catch (error: any) {
    handleGeminiError(error, res);
  }
});

// ------------------------------------
// POST /api/gemini/autopilot
// ------------------------------------

router.post('/autopilot', async (req: Request, res: Response) => {
  try {
    const { tasks } = req.body;

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      res.status(400).json({ error: 'Missing required field: tasks (non-empty array)' });
      return;
    }

    const prompt = `You are the DeadlineAI Autopilot agent. Analyze the following tasks and return a JSON object that exactly matches the schema below. Do not return markdown blocks, just raw JSON.

Task List:
${formatTasksForPrompt(tasks)}

Required JSON Schema:
{
  "conflicts": ["List of detected deadline conflicts or at-risk tasks"],
  "subtasks": [
    {
      "parentTaskTitle": "Original task title to break down",
      "title": "Subtask title",
      "estimatedMinutes": 30
    }
  ],
  "schedule": ["Time blocked plan for today and tomorrow"],
  "summary": "2-sentence plain English summary of what changes you made."
}

Break down complex tasks into 2-3 smaller subtasks with estimated minutes. Detect any scheduling conflicts.`;

    const ai = getModel();
    // Using gemini-1.5-pro or gemini-2.5-flash with json instructions.
    // Since generateWithRetry doesn't natively accept generationConfig, we'll just prompt it.
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = result.text;
    res.json({ response: responseText });
  } catch (error: any) {
    handleGeminiError(error, res);
  }
});

export default router;
