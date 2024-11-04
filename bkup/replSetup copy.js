// replSetup.js
const repl = require('repl');
const fs = require('fs');
const WebSocket = require('ws');

// Load environment variables from .env file
if (fs.existsSync('.env')) {
    require('dotenv').config();
}

// Start the REPL
const replServer = repl.start({ prompt: 'mongo-repl> ' });

// Load utility functions if you have any
const manipulateDataPath = './manipulateData.js';
if (fs.existsSync(manipulateDataPath)) {
    const manipulateData = require(manipulateDataPath);
    Object.assign(replServer.context, manipulateData);
}

// Start WebSocket Server
const wss = new WebSocket.Server({ port: 8080 }, () => {
    console.log('WebSocket server started on port 8080');
});


// Handle REPL exit
replServer.on('exit', async () => {
    if (client.isConnected && client.topology?.isConnected()) {
        await client.close();
        console.log("MongoDB connection closed in REPL.");
    }
    wss.close(() => {
        console.log('WebSocket server closed');
        process.exit(0);
    });
});
