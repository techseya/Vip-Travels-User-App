import { createAsyncThunk } from "@reduxjs/toolkit";
import { url } from "src/constants/info";
import { validate } from "src/utils/helpers/validation";
import http from "src/utils/tools/http";

//EDIT PROFILE 
export const editProfile = createAsyncThunk('app/editProfile',async(data)=>{
    const res = validate([
        'first_name:is_empty',
        'last_name:is_empty',
        'mobile:is_empty',
        'email:is_empty',
    ],data);
    if(res !== true) throw res;
    try {
        const res = await http.post(url.editProfile,data);
        return res.data;
    } catch (error) {
        throw error.message;
    }
})


export const getTripHistory = createAsyncThunk('app/getTripHistory',async(data)=>{
    try {
        const res = await http.post(url.getTripHistory,data);
        return res.data;
    } catch (error) {
        throw error.message;
    }
})

export const getRentVehicleType = createAsyncThunk('app/getRentVehicleType',async(data)=>{
    try {
        const res = await http.post(url.getVehicleType,data);
        return res.data;
    } catch (error) {
        throw error.message;
    }
})

export const generateFarePackage = createAsyncThunk('app/generateFarePackage',async(data)=>{
    try {
        const res = await http.post(url.generateFarePackage,data);
        return res.data;
    } catch (error) {
        throw error.message;
    }
})

export const addCabHire = createAsyncThunk('app/addCabHire',async(data)=>{
    try {
        const res = await http.post(url.addCabHire,data);
        console.log(res.data);
        return res.data;
    } catch (error) {
        throw error.message;
    }
})

export const getVehicleType = createAsyncThunk('app/getVehicleType',async(data)=>{
    try {
        const res = await http.post(url.getVehicleType,data);
        return res.data;
    } catch (error) {
        throw error.message;
    }
})

export const matchCabDriver = createAsyncThunk('app/matchCabDriver',async(data)=>{
    try {
        const res = await http.post(url.matchCabDriver,data);
        console.log('matchCabDriver',res.data);
        return res.data;
    } catch (error) {
        throw error.message;
    }
})
export const checkCabDriver = createAsyncThunk('app/checkCabDriver',async(data)=>{
    console.log(data);
    try {
        const res = await http.post(url.checkCabDriver,data);
        console.log('checkCabDriver',res.data);
        return res.data;
    } catch (error) {
        throw error.message;
    }
})
export const hireLoop = createAsyncThunk('app/hireLoop',async(data)=>{
    try {
        const res = await http.post(url.hireLoop,data);
        console.log('hireLoop',res.data);
        return res.data;
    } catch (error) {
        throw error.message;
    }
})
export const cancelHire = createAsyncThunk('app/cancelHire',async(data)=>{
    try {
        const res = await http.post(url.cancelHire,data);
        return res.data;
    } catch (error) {
        throw error.message;
    }
})
export const changeDropoffLocation = createAsyncThunk('app/changeDropoffLocation',async(data)=>{
    try {
        const res = await http.post(url.changeDropoffLocation,data);
        return res.data;
    } catch (error) {
        throw error.message;
    }
})
export const reviewHire = createAsyncThunk('app/reviewHire',async(data)=>{
    try {
        const res = await http.post(url.reviewHire,data);
        return res.data;
    } catch (error) {
        throw error.message;
    }
})

export const getRentModles = createAsyncThunk('app/getRentModles',async(data)=>{
    try {
        const res = await http.post(url.getRentModles,data);
        return res.data;
    } catch (error) {
        throw error.message;
    }
})
export const getRentPackages = createAsyncThunk('app/getRentPackages',async(data)=>{
    try {
        const res = await http.post(url.getRentPackages,data);
        return res.data;
    } catch (error) {
        throw error.message;
    }
})
export const addCarRent = createAsyncThunk('app/addCarRent',async(data)=>{
    try {
        const res = await http.post(url.addCarRent,data);
        return res.data;
    } catch (error) {
        throw error.message;
    }
})



export const getWeddingModles = createAsyncThunk('app/getWeddingModles',async(data)=>{
    try {
        const res = await http.post(url.getWeddingModles,data);
        return res.data;
    } catch (error) {
        throw error.message;
    }
})
export const getWeddingPackages = createAsyncThunk('app/getWeddingPackages',async(data)=>{
    try {
        const res = await http.post(url.getWeddingPackages,data);
        return res.data;
    } catch (error) {
        throw error.message;
    }
})
export const addWeddingRent = createAsyncThunk('app/addWeddingRent',async(data)=>{
    try {
        const res = await http.post(url.addWeddingRent,data);
        return res.data;
    } catch (error) {
        throw error.message;
    }
})


