// ws-server.js
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const fs = require('fs');
const WebSocket = require('ws');
const sharedEmitter = require('./shared'); // Import the shared emitter

// Load environment variables from .env file
if (fs.existsSync('.env')) {
    require('dotenv').config();
}

const app = express();
const port = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

app.use(express.json());

// Function to connect to the REPL's WebSocket server
let ws;

function connectToREPL() {
    ws = new WebSocket('ws://localhost:8080');

    ws.on('open', () => {
        console.log('Server connected to REPL WebSocket server');
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed. Reconnecting...');
        setTimeout(connectToREPL, 1000);
    });
}

// **Define routes before starting the server**

// Read (Find) endpoint
app.get("/find/:database/:collection", async (req, res) => {
    try {
        const { database, collection } = req.params;
        const db = client.db(database);
        const documents = await db.collection(collection).find({}).toArray();

        // Send the documents to the REPL via WebSocket
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'documentsFetched', documents }));
            console.log('Documents sent to REPL via WebSocket');
        }

        res.status(200).json(documents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create (Insert) endpoint
app.post("/insert/:database/:collection", async (req, res) => {
    try {
        const { document } = req.body;
        const { database, collection } = req.params;
        const db = client.db(database);

        const result = await db.collection(collection).insertOne(document);
        res.status(201).send(`Document inserted with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete endpoint
app.delete("/delete/:database/:collection/:id", async (req, res) => {
    try {
        const { database, collection, id } = req.params;
        const db = client.db(database);

        const result = await db.collection(collection).deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
            res.status(200).send(`Document with ID ${id} deleted successfully.`);
        } else {
            res.status(404).send(`Document with ID ${id} not found.`);
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// **Start the server after defining routes**
async function startServer() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        // Connect to the REPL's WebSocket server
        connectToREPL();

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit the process if the connection fails
    }
}

startServer();
