const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const { connect, client } = require('./database');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(express.static('public'));

// Connect to MongoDB
connect();

// Signup route
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = client.db('expresSit'); // Replace with your database name
        const usersCollection = db.collection('users');

        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(400).send({ success: false, message: 'Username already exists' });
        }

        await usersCollection.insertOne({ username, password });
        res.send({ success: true, username });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = client.db('expresSit'); // Replace with your database name
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ username, password });
        if (!user) {
            return res.status(400).send({ success: false, message: 'Invalid username or password' });
        }

        res.send({ success: true, username });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
});

// Socket.io connection
let users = [];

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
