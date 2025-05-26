const socket = io();

// server (emit) -> client (receive) --acknowledgement--> server
// client (emit) -> server (recieve) --acknowledgement--> client


socket.on('message', (message) => {
    console.log(message)
})

const form = document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {
        if(error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    });

    e.target.elements.message.value = "";
})


document.getElementById('send-location').addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', { latitude: position.coords.latitude, longitude: position.coords.longitude}, error => {
            if(error) {
                return console.log(error)
            }

            console.log('Location shared!')
        })
    })
})