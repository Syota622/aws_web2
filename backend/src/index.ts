import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';

const app = new Hono();

// Middleware
app.use('*', logger());

// Routes
app.get('/', (c) => {
  console.log('Received request to root endpoint111');
  return c.json({
    message: 'Hello from Hono!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/hello/:name', (c) => {
  const name = c.req.param('name');
  console.log(`Received request to /api/hello/${name}`);
  return c.json({
    message: `Hello, ${name}!`,
    timestamp: new Date().toISOString()
  });
});

// Start the server
const port = process.env.PORT || 3000;

// Using a more explicit server creation
const server = serve({
  fetch: app.fetch,
  port: Number(port),
  hostname: '0.0.0.0' // This is important to allow connections from outside the container
});

console.log(`Server is running on http://0.0.0.0:${port}`);

// Handle server errors
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  process.exit(0);
});