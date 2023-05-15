const decodeString = (string)=>{
    string = decodeURIComponent(string.replace(/\+/g, ' '))
    string = decodeURIComponent(string.replace(/\+/g, ' '))
    return string
}

export default decodeString;