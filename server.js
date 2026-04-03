const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server: SocketServer } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketServer(httpServer, {
    cors: {
      origin: dev ? '*' : undefined,
      methods: ['GET', 'POST'],
    },
    pingInterval: 10000,
    pingTimeout: 5000,
  });

  // Import and initialize socket handlers
  // We use dynamic require here since the server code will be compiled
  const { initializeSocketHandlers } = require('./server/socketHandlers');
  initializeSocketHandlers(io);

  httpServer.listen(port, () => {
    console.log(`
  ╔══════════════════════════════════════════════╗
  ║   Clockwork Wonderland - Card Game Server    ║
  ║──────────────────────────────────────────────║
  ║   http://${hostname}:${port}                      ║
  ║   Mode: ${dev ? 'Development' : 'Production '}                       ║
  ╚══════════════════════════════════════════════╝
    `);
  });
});
