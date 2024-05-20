document.addEventListener("DOMContentLoaded", () => {
    const socket = io();

    const loginBtn = document.querySelector('.login-button');
    const signupBtn = document.querySelector('.signup-button');
    const connectButton = document.querySelector('#connectButton');
    const currentMoodOptions = document.querySelectorAll('.mood-window-left .mood-option');
    const moodYouWantBox = document.getElementById('moodYouWantBox');
    const moodYouWantOptions = document.querySelectorAll('.mood-window-right .mood-option');
    const identityBox = document.getElementById('identityBox');
    const identityOptions = document.querySelectorAll('input[name="identity"]');

    let selectedCurrentMood = null;
    let selectedMoodWant = null;
    let selectedIdentity = null;

    // Handle mood selection for "Current Mood"
    currentMoodOptions.forEach(option => {
        option.addEventListener('click', () => {
            selectedCurrentMood = option.textContent.trim();
            moodYouWantBox.classList.remove('dimmed');
        });
    });

    // Handle mood selection for "Mood You Want"
    moodYouWantOptions.forEach(option => {
        option.addEventListener('click', () => {
            selectedMoodWant = option.textContent.trim();
            identityBox.classList.remove('dimmed');
            identityOptions.forEach(input => input.disabled = false);
        });
    });

    // Handle identity selection
    identityOptions.forEach(option => {
        option.addEventListener('change', () => {
            selectedIdentity = option.value;
            connectButton.disabled = false;
            connectButton.classList.remove('dimmed');
        });
    });

    // Handle login button click
    loginBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    // Handle signup button click
    signupBtn.addEventListener('click', () => {
        window.location.href = 'signup.html';
    });

    // Handle form submissions
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();
            if (result.success) {
                alert('Login successful!');
                // Redirect or handle successful login
            } else {
                alert(result.message);
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const response = await fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();
            if (result.success) {
                alert('Signup successful!');
                // Redirect or handle successful signup
            } else {
                alert(result.message);
            }
        });
    }

    // Handle connect button click
    connectButton.addEventListener('click', () => {
        if (selectedCurrentMood && selectedMoodWant && selectedIdentity) {
            socket.emit('setMood', {
                currentMood: selectedCurrentMood,
                wantedMood: selectedMoodWant,
                identity: selectedIdentity
            });

            socket.on('matched', (data) => {
                console.log('Matched with:', data);

                const videoCallDiv = document.createElement('div');
                videoCallDiv.id = 'videoCall';
                document.body.appendChild(videoCallDiv);

                const peer = new SimplePeer({ initiator: true });

                peer.on('signal', data => {
                    socket.emit('signal', data);
                });

                socket.on('signal', data => {
                    peer.signal(data);
                });

                peer.on('stream', stream => {
                    const video = document.createElement('video');
                    video.srcObject = stream;
                    video.play();
                    videoCallDiv.appendChild(video);
                });
            });
        }
    });
});
