// manipulateData.js
const fs = require('fs');
const path = require('path');

// Define the path to the JSON file
const jsonFilePath = path.join(__dirname, 'foundDocuments.json');

// Initialize the documents variable
let documents = [];
function readOutput() {
    // Read the JSON file synchronously
    try {
        const data = fs.readFileSync(jsonFilePath, 'utf8');
        const trimmedData = data.trim();
        documents = JSON.parse(trimmedData);

        if (documents.length > 0) {
            console.log('First document:', documents[0]);
        } else {
            console.log('No documents found.');
        }
    } catch (err) {
        console.error('Error reading or parsing JSON file:', err);
    }
}
// Function to log document keys
function logDocumentKeys(doc) {
    for (let key in doc) {
        console.log(`${key}: ${doc[key]}`);
    }
}

// Getter function to retrieve documents
function getDocuments() {
    return documents;
}

// Function to save documents back to the JSON file
function saveDocuments() {
    try {
        fs.writeFileSync(jsonFilePath, JSON.stringify(documents, null, 2), 'utf8');
        console.log('Documents successfully saved to JSON file.');
    } catch (err) {
        console.error('Error writing JSON file:', err);
    }
}

// Export the functions
module.exports = { getDocuments, logDocumentKeys, saveDocuments, readOutput };
