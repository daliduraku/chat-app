const socket = io();

const input = document.getElementById('message');

socket.on('sendMessage', (msg) => {
    console.log('Message from server: ', msg);
})

const form = document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const message = input.value;
    console.log('submit', message);
    socket.emit('sendMessage', message);

    input.value = "";
})
