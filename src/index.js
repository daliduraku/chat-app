import express from 'express';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';


const app = express();
const server = http.createServer(app)
const io = new Server(server);
const port = process.env.PORT || 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

let count = 0;

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.emit('sendMessage', "Welcome!");

    socket.on('sendMessage', (msg) => { 
        io.emit('sendMessage', msg)
    })
})

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});