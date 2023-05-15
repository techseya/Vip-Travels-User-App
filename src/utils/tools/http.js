import axios from "axios";

const http = axios.create({
    baseURL:' http://192.168.1.2:5012',
    headers:{
        'Content-type': 'application/json',
        Accept: 'application/json',
    }
})

http.interceptors.request.use(
    (req)=>{
        req.headers.Accept = 'application/json';
        return req;
    },
    (err)=>{
        return Promise.reject(err);
    }
)
http.interceptors.response.use(
    (res)=>{
        return res;
    },
    (err)=>{
        return Promise.reject(err.response.data)
    }
)

export default http;