import { createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getData } from "src/utils/helpers/asyncData";

export const _isWelcome = createAsyncThunk('walkthrough/_isWelcome',async()=>{
    const res = await getData('isWelcome');
    return res;
})

export const getCurrentUser = createAsyncThunk('walkthrough/getCurrentUser',async()=>{
    const res = await getData('user');
    await new Promise((res,rej)=>{
        setTimeout(()=>res(),1500);
    })
    return res;
})

export const setWelcome = ()=>AsyncStorage.setItem('isWelcome','true')