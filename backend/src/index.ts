import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';

const app = new Hono();

// Environment variables and constants
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;
const allowedOrigins = isProduction 
  ? ['https://api.mokokero.com', 'https://mokokero.com'] 
  : ['http://localhost:3000'];

// CORS middleware - more restrictive in production
app.use('*', cors({
  origin: (origin) => {
    // In production, only allow specific origins
    if (isProduction) {
      return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
    }
    // In development, be more permissive
    return origin;
  },
  credentials: true,
}));

// Logging middleware
app.use('*', logger());

// Routes
app.get('/', (c) => {
  const environment = isProduction ? 'production' : 'development';
  console.log(`Received request to root endpoint in ${environment} environment`);
  
  return c.json({
    message: 'Hello from Hono API!',
    environment,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/hello/:name', (c) => {
  const name = c.req.param('name');
  console.log(`Received request to /api/hello/${name}`);
  
  return c.json({
    message: `Hello, ${name}!`,
    environment: isProduction ? 'production' : 'development',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint for ECS
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Start the server
const server = serve({
  fetch: app.fetch,
  port: Number(port),
  hostname: '0.0.0.0'
});

console.log(`Server is running in ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} mode`);
console.log(`Listening on http://0.0.0.0:${port}`);

// Handle server shutdown gracefully
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Termination signal received. Shutting down...');
  process.exit(0);
});
