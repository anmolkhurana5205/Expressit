const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(express.static('public'));

let users = [];

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Placeholder for actual login logic
    res.send({ success: true, username });
});

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    // Placeholder for actual signup logic
    res.send({ success: true, username });
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('setMood', (data) => {
        users.push({ id: socket.id, ...data });
        // Placeholder for matching logic
        const match = users.find(user => user.mood === data.wantedMood);
        if (match) {
            io.to(socket.id).emit('matched', match);
            io.to(match.id).emit('matched', data);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
