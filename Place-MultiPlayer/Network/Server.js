const WebSocket = require('ws');

const canvas = Array(25)
    .fill(null)
    .map(() => Array(30).fill('#FFFFFF')); // Adjust columns and default color

// Create WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

let users = []; // List of connected players

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('A new client connected');

    // Handle incoming messages
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'join') {
                handleJoin(ws, data); // Call handleJoin for "join" messages
            } else if (data.type === 'pixelPlaced') {
                handlePixelPlaced(ws, data); // Call handlePixelPlaced for pixel updates
            } else {
                console.log('Unknown message type:', data.type);
            }
        } catch (err) {
            console.error('Error parsing message:', err);
        }
    });

    // Handle client disconnections
    ws.on('close', () => {
        handleDisconnect(ws); // Handle player disconnection
    });
});

// Function to handle player join
function handleJoin(ws, data) {
    const name = data.name;

    // Associate the WebSocket connection with the player's name
    ws.name = name;

    // Add the player to the list if not already present
    if (!users.includes(name)) {
        users.push(name);
    }

    console.log(`${name} joined the game`);


    // Send the full canvas state to the new client
    ws.send(JSON.stringify({ type: 'canvasState', canvas }));

    // Broadcast the updated player list to all clients
    broadcast({
        type: 'update',
        users,
    });
}

// Function to handle pixel placement
function handlePixelPlaced(ws, data) {
    const { color, x, y } = data;

    // Log the pixel placement
    console.log(`Pixel placed: Color=${color}, X=${x}, Y=${y}`);

    // Update the canvas state
    canvas[y][x] = color;

    // Broadcast the pixel placement to all clients
    broadcast({
        type: 'updatePixel',
        color: color || '#FFFFFF', // Default to white if no color is provided
        x,
        y,
    });
}

// Function to handle player disconnect
function handleDisconnect(ws) {
    if (ws.name) {
        console.log(`${ws.name} disconnected`);

        // Remove the player from the list
        users = users.filter((user) => user !== ws.name);

        // Broadcast the updated player list to all clients
        broadcast({
            type: 'update',
            users,
        });
    }
}

// Function to broadcast a message to all clients
function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

console.log('WebSocket server is running on ws://localhost:8080');
