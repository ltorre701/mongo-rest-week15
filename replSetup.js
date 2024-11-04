const repl = require('repl');
const fs = require('fs');
const WebSocket = require('ws');
const sharedEmitter = require('./shared');  // Add this

// Start the REPL
const replServer = repl.start({ prompt: 'mongo-repl> ' });

// Initialize documents in REPL context
replServer.context.documents = [];

// Listen for document updates via the shared emitter
sharedEmitter.on('documentsFetched', (documents) => {
    replServer.context.documents = documents;
    console.log('Documents updated in REPL context. Type "documents" to see them.');
});

// WebSocket server setup remains the same
const wss = new WebSocket.Server({ port: 8080 }, () => {
    console.log('WebSocket server started on port 8080');
});

wss.on('connection', (ws) => {
    console.log('Server connected to REPL via WebSocket');
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'documentsFetched') {
                replServer.context.documents = data.documents;
                console.log('Documents updated in REPL context via WebSocket.');
            }
        } catch (err) {
            console.error('Error parsing message:', err);
        }
    });
});