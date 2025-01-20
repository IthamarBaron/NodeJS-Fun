const http = require('http');
const fs = require('fs');
const path = require('path');

let connectedUsers = []; 

const server = http.createServer((req, res) => 
{
    console.log(`Received ${req.method} request for ${req.url}`);

    if (req.method === 'GET' && req.url === '/') 
    {
        const filePath = path.join(__dirname, 'index.html');
        fs.readFile(filePath, (err, content) => 
        {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } 
    else if (req.method === 'GET' && req.url === '/style.css') 
    {
        const filePath = path.join(__dirname, 'style.css');
        fs.readFile(filePath, (err, content) => 
        {
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(content);
        });
    } 
    else if (req.method === 'POST' && req.url === '/submit') 
    {
        let body = '';

        req.on('data', chunk => 
        {
            body += chunk.toString();
        });

        // Process the complete body when data transfer ends
        req.on('end', () => 
        {
            const parsedData = new URLSearchParams(body);
            const name = parsedData.get('name');

            if (name && !connectedUsers.includes(name)) 
            {
                connectedUsers.push(name);
            }

            console.log('Connected Users:', connectedUsers);

            // Respond with the list of connected users
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`
                <h1>Welcome, ${name}!</h1>
                <h2>Connected Users:</h2>
                <ul>
                    ${connectedUsers.map(user => `<li>${user}</li>`).join('')}
                </ul>
            `);
        });
    } 
    else 
    {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
    }
});

// Start listening
const PORT = 3000;
server.listen(PORT, () => 
{
    console.log(`Server running at http://localhost:${PORT}`);
});
