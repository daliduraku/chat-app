export function generateMessage(text) {
    return {
        text, 
        createdAt: new Date().getTime()
    }
}


export function generateLocationMessage(username, url) {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}