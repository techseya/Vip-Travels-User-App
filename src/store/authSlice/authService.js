import { createAsyncThunk } from '@reduxjs/toolkit'
import { url } from 'src/constants/info';
import { validate } from 'src/utils/helpers/validation';
import http from 'src/utils/tools/http'

export const signUp = createAsyncThunk('auth/signUp',async(data)=>{
    const res = validate(['email:is_empty','mobile:is_empty','password:is_empty','confirm:is_empty'],data);
    if(res !== true) throw res;
    try {
        const result = await http.post(url.signUp,data);
        // await new Promise((res,rej)=>{
        //     setTimeout(()=>res(),1500);
        // })
        return  result.data
    } catch (error) {
        throw error.message;
    }
})

export const login = createAsyncThunk('auth/login',async(data)=>{
    try {
        const result = await http.post(url.login,data);
        // await new Promise((res,rej)=>{
        //     setTimeout(()=>res(),1500);
        // })
        return  result.data
    } catch (error) {
        throw error.message;
    }
})

export const autoLogin = createAsyncThunk('auth/autoLogin',async(data)=>{
    try {
        const result = await http.post(url.autoLogin,data);
        // await new Promise((res,rej)=>{
        //     setTimeout(()=>res(),1500);
        // })
        return  result.data
    } catch (error) {
        throw error.message;
    }
})

export const logOut = createAsyncThunk('auth/logOut',async(data)=>{
    try {
        const result = await http.post(url.logout,data);
        return  result.data
    } catch (error) {
        throw error.message;
    }
})