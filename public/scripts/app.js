document.addEventListener("DOMContentLoaded", () => {
    const socket = io();

    const loginBtn = document.querySelector('.login-button');
    const signupBtn = document.querySelector('.signup-button');
    const connectButton = document.querySelector('.match-window');
    const currentMoodOptions = document.querySelectorAll('.mood-window-left .mood-option');
    const moodYouWantOptions = document.querySelectorAll('.mood-window-right .mood-option');
    const identityOptions = document.querySelectorAll('.identity-option');

    let selectedCurrentMood = null;
    let selectedMoodWant = null;
    let selectedIdentity = null;

    // Handle mood selection for "Current Mood"
    currentMoodOptions.forEach(option => {
        option.addEventListener('click', () => {
            selectedCurrentMood = option.textContent.trim();
            document.querySelector('.mood-window-right').classList.remove('dimmed');
        });
    });

    // Handle mood selection for "Mood You Want"
    moodYouWantOptions.forEach(option => {
        option.addEventListener('click', () => {
            selectedMoodWant = option.textContent.trim();
            document.querySelector('.identity-window').classList.remove('dimmed');
        });
    });

    // Handle identity selection
    identityOptions.forEach(option => {
        option.addEventListener('click', () => {
            selectedIdentity = option.textContent.trim();
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
