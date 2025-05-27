const socket = io();

// server (emit) -> client (receive) --acknowledgement--> server
// client (emit) -> server (recieve) --acknowledgement--> client

// Elements
const $messageForm = document.getElementById('form');
const $messageFormInput = $messageForm.querySelector('#message');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.getElementById('send-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const urlTemplate = document.querySelector('#url-template').innerHTML;
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML;

// options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


function autoscroll() {
    // new message element
    const $newMessage = $messages.lastElementChild;

    // height of the last message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // visible height
    const visibleHeight = $messages.offsetHeight

    // height of messages container
    const containerHeight = $messages.scrollHeight

    // how far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
}



socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
})

socket.on('locationMessage', location => {
   console.log(location)
   const html = Mustache.render(urlTemplate, {
    username: location.username,
    url: location.url,
    createdAt: moment(location.createdAt).format('h:mm a')
   });
   $messages.insertAdjacentHTML('beforeend', html);
   autoscroll();
})


socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sideBarTemplate, {
        room,
        users
    })
    document.getElementById('sidebar').innerHTML = html;
})



$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //disable
    $messageFormButton.setAttribute('disabled', 'disabled');

    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus()
        //enable
        

        if(error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    });

    e.target.elements.message.value = "";
})


$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    // disable button 
    $sendLocationButton.setAttribute('disable', 'disable');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', { latitude: position.coords.latitude, longitude: position.coords.longitude},() => {
            
            $sendLocationButton.removeAttribute('disable');
            console.log('Location shared!')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})