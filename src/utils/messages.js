export function generateMessage(text) {
    return {
        text, 
        createdAt: new Date().getTime()
    }
}


export function generateLocationMessage(location) {
    return {
        url: location,
        createdAt: new Date().getTime()
    }
}