import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice/authSlice'
import walkthroughReducer from './walkthroughSlice/walkthroughSlice'
import appReducer from './appSlice/appSlice'

const store = configureStore({
    reducer:{
        auth:authReducer,
        walkthrough:walkthroughReducer,
        app:appReducer
    },
});

export default store;