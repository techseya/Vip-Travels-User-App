import {createSlice} from '@reduxjs/toolkit';
import {autoLogin, logOut, login, signUp} from './authService';
import {removeItem, setData} from 'src/utils/helpers/asyncData';
import {getCurrentUser} from '../walkthroughSlice/walkthroughService';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    getCurrentUser: false,
    autoLogin: false,
    currentUser: null,
    user_data: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    resetAuthCache: (state) => {
      state = initialState;
    },
    removeError: state => {
      state.error = null;
    },
    setEditProfile: (state, action) => {
      state.currentUser = {...state.currentUser, ...action.payload.result};
    },
  },
  extraReducers: builder => {
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.getCurrentUser = true;
      state.currentUser = action.payload;
    });
    builder.addCase(signUp.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.currentUser = {...action.payload.result};
      setData('user', {...action.payload.result});
      state.isLoading = false;
      state.user_data = action.payload;
    });
    builder.addCase(signUp.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(login.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.currentUser = {...action.payload.result};
      setData('user', {...action.payload.result});
      state.isLoading = false;
      state.user_data = action.payload;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(autoLogin.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(autoLogin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user_data = action.payload;
    });
    builder.addCase(autoLogin.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(logOut.pending, state => {
      state.isLoading = true;
    });
    builder.addCase(logOut.fulfilled, state => {
      removeItem('user');
      state.isLoading = false;
      state.user_data = null;
    });
    builder.addCase(logOut.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
  },
});
export const {resetAuthCache,removeError, setEditProfile} = authSlice.actions;
export default authSlice.reducer;
