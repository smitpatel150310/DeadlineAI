import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from multiple possible locations
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const geminiKey = process.env.GEMINI_API_KEY;
if (geminiKey && geminiKey.trim().length > 0) {
  if (/\s/.test(geminiKey)) {
    console.warn('Gemini API key contains whitespace. Re-paste the key in server/.env.');
  }
}

import geminiRouter, { isGeminiInitialized } from './routes/gemini';

const app = express();
const PORT = process.env.PORT || 3001;
const isDev = process.env.NODE_ENV !== 'production';

// ------------------------------------
// Middleware
// ------------------------------------

// CORS configuration
app.use(
  cors({
    origin: isDev
      ? ['http://localhost:5173', 'http://127.0.0.1:5173']
      : true,
    credentials: true,
  })
);

// JSON body parser
app.use(express.json({ limit: '10mb' }));

// Request logging (development)
if (isDev) {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ------------------------------------
// API Routes
// ------------------------------------

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Gemini AI routes
app.use('/api/gemini', geminiRouter);

// ------------------------------------
// Static files & SPA fallback (production)
// ------------------------------------

if (!isDev) {
  const clientDistPath = path.join(__dirname, '../../client/dist');

  // Serve static files from client build
  app.use(express.static(clientDistPath));

  // SPA fallback: serve index.html for all non-API routes
  app.get('*', (req: Request, res: Response) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api')) {
      res.status(404).json({ error: 'API route not found' });
      return;
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// ------------------------------------
// Error handling middleware
// ------------------------------------

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server Error]', err.message);
  console.error(err.stack);

  res.status(500).json({
    error: 'Internal server error',
    message: isDev ? err.message : 'Something went wrong',
  });
});

// ------------------------------------
// Start server
// ------------------------------------

app.listen(PORT, () => {
  console.log('');
  console.log('='.repeat(50));
  console.log('  DeadlineAI Server');
  console.log('='.repeat(50));
  console.log(`  Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Port        : ${PORT}`);
  console.log(`  GEMINI_API_KEY loaded: ${process.env.GEMINI_API_KEY ? 'yes' : 'no'}`);
  console.log(`  Gemini client initialized: ${isGeminiInitialized ? 'yes' : 'no'}`);
  console.log(`  Supabase    : ${process.env.SUPABASE_URL ? 'configured' : 'NOT SET'}`);
  console.log('='.repeat(50));
  console.log('');
});

export default app;
