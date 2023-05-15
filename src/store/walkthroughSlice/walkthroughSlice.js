import { createSlice } from "@reduxjs/toolkit";
import { _isWelcome, setWelcome } from "./walkthroughService";

const walkthroughSlice = createSlice({
    name:'walkthrough',
    initialState:{
        isLoading:false,
        isWelcome:false,
    },
    reducers:{
        continueApp:(state)=>{
            setWelcome();
            state.isWelcome = true;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(_isWelcome.fulfilled,(state,action)=>{
            state.isLoading = true;
            state.isWelcome = action.payload;
        })
    }
})

export const {continueApp} = walkthroughSlice.actions;
export default walkthroughSlice.reducer;