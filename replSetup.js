// replSetup.js
const repl = require('repl');
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const WebSocket = require('ws');

// Load environment variables from .env file
if (fs.existsSync('.env')) {
    require('dotenv').config();
}

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

// Function to connect to MongoDB
async function connectDB() {
    if (!client.isConnected && !client.topology?.isConnected()) {
        await client.connect();
        console.log("Connected to MongoDB in REPL");
    }
    return client.db('inventory'); // Default database
}

// Start the REPL
const replServer = repl.start({ prompt: 'mongo-repl> ' });

// Expose MongoDB client and utilities to REPL
replServer.context.connectDB = connectDB;
replServer.context.ObjectId = ObjectId;
replServer.context.client = client;

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

// Handle incoming WebSocket connections
wss.on('connection', (ws) => {
    console.log('Server connected to REPL via WebSocket');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'documentsFetched') {
                replServer.context.documents = data.documents;
                console.log('Documents have been updated in the REPL context as "documents".');
            }
        } catch (err) {
            console.error('Error parsing message:', err);
        }
    });
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
