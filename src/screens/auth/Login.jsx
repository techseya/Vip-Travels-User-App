import React from 'react'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button, Dialog, Portal, Surface , Text, TextInput } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import {SHA1} from 'crypto-js'
import {AuthLogo} from 'src/assets/images'
import { Hr } from 'src/components'
import colors from 'src/constants/colors'
import { apiInfo, height, width } from 'src/constants/info'
import { login } from 'src/store/authSlice/authService'
import { removeError } from 'src/store/authSlice/authSlice'
// import { GoogleSignin , statusCodes } from '@react-native-google-signin/google-signin'

const Login = () => {
  const dispatch = useDispatch()
  const error = useSelector(state=>state.auth.error)
  const [user,setUser] = React.useState({email:'',password:''})
  
  // signIn = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     console.log(userInfo);
  //   } catch (error) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //     console.log(error);
  //     // user cancelled the login flow
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //     console.log(error);
  //     // operation (e.g. sign in) is in progress already
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //     console.log(error);
  //     // play services not available or outdated
  //     } else {
  //     console.log(error);
  //     // some other error happened
  //     }
  //   }
  // };

  return (
    <KeyboardAwareScrollView>
      <Portal>
        <Dialog visible={error != null  ? true : false} onDismiss={()=>dispatch(removeError())}>
          <Dialog.Icon icon="alert" />
          <Dialog.Title style={{color:colors.DARK}}>Authentication Error</Dialog.Title>
          <Dialog.Content>
            <Text style={{color:colors.DARK}} variant="bodyMedium">{error}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={()=>dispatch(removeError())} labelStyle={{color:colors.PLACEHOLDER}}>Okay</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <View style={{height:height,backgroundColor:colors.LIGHT,alignItems:'center'}}>
        <AuthLogo width='90%' />
        <Surface style={{width:width,height:height/2,backgroundColor:colors.LIGHT,position:'absolute',bottom:0,borderTopEndRadius:30,borderTopStartRadius:30,alignItems:'center'}} elevation={5}>
          <Hr styles={{height:2,marginVertical:28}}/>
          <Text variant='title_xl' style={{color:colors.DARK,textAlign:'center'}}>SIGN IN</Text>
          <View style={{width:'90%',padding:5}}>
            <TextInput
            onChangeText={val=>setUser({...user,email:val})}
            style={{marginTop:25}}
            mode='outlined'
            activeOutlineColor={colors.INPUT_BORDER}
            outlineColor={colors.INPUT_BORDER}
            outlineStyle={{borderRadius:10}}
            placeholderTextColor={colors.PLACEHOLDER}
            textColor={colors.DARK}
            placeholder='Email'/>
            <TextInput
            onChangeText={val=>setUser({...user,password:`${SHA1(val)}`})}
            secureTextEntry
            style={{marginTop:25}}
            mode='outlined'
            activeOutlineColor={colors.INPUT_BORDER}
            outlineColor={colors.INPUT_BORDER}
            outlineStyle={{borderRadius:10}}
            placeholderTextColor={colors.PLACEHOLDER}
            textColor={colors.DARK}
            placeholder='Password'/>
          </View>
          {/* <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:20}}>
            <Hr styles={{height:1}}/>
            <Text style={{color:colors.PLACEHOLDER,fontSize:18,fontFamily:'SegoeUI-Bold',marginHorizontal:15}}>OR</Text>
            <Hr styles={{height:1}}/>
          </View> */}
          <View style={{rowGap:8,marginBottom:20,flexDirection:'column',alignItems:'center',marginTop:20}}>
            {/* <IconButton icon={GoogleIcon} size={50} onPress={()=>signIn()} /> */}
            <Button contentStyle={{paddingHorizontal:13,paddingVertical:3}} labelStyle={{fontWeight:'bold',fontSize:20,color:colors.LIGHT,marginTop:13}} onPress={()=>dispatch(login({...user,...apiInfo('login')}))} mode='contained'>SIGN IN</Button>
          </View>
        </Surface>
      </View>
    </KeyboardAwareScrollView>
  )
}

export default Login