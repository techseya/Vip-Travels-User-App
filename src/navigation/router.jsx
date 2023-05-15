import React from 'react'
import { useDispatch , useSelector } from 'react-redux'
import appStack from './appStack/appStack';
import authStack from './authStack/authStack';
import splashStack from './splashStack/splashStack';
import walkthroughStack from './walkthroughStack/walkthroughStack';
import { _isWelcome, getCurrentUser } from 'src/store/walkthroughSlice/walkthroughService';
import { autoLogin } from 'src/store/authSlice/authService';
import { apiInfo } from 'src/constants/info';


const Router = () => {
  const dispatch = useDispatch();
  const state = useSelector(state=>state);
  React.useEffect(()=>{
    if(state.walkthrough.isLoading && state.auth.getCurrentUser){
      if(state.walkthrough.isWelcome){
        if(state.auth.currentUser){
          dispatch(autoLogin({
            session_id:state.auth.currentUser.session_id,
            user_id:state.auth.currentUser.user_id,
            log_id:state.auth.currentUser.log_id,
            ...apiInfo('autoLogin')
          }))
        }
      }
    }else{
      dispatch(_isWelcome());
      dispatch(getCurrentUser());
    }
  },[state.walkthrough.isLoading,state.auth.getCurrentUser,state.app.screens])
  return (
    <>
      {state.walkthrough.isLoading && state.auth.getCurrentUser ? state.walkthrough.isWelcome ? state.auth.user_data ? appStack(state.app.screens) : authStack() : walkthroughStack() : splashStack()}
      {/* {appStack()} */}
    </>
  )
}

export default Router