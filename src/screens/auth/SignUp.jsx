import React from 'react'
import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Button, Dialog, Portal, Surface , Text, TextInput } from 'react-native-paper'
import { useDispatch, useSelector } from 'react-redux'
import {SHA1} from "crypto-js"
import { signUp } from 'src/store/authSlice/authService'
import { removeError } from 'src/store/authSlice/authSlice'
import {AuthLogo} from 'src/assets/images'
import { Hr } from 'src/components'
import colors from 'src/constants/colors'
import { apiInfo, height, width } from 'src/constants/info'

const SignUp = () => {
  const [user,setUser] = React.useState({email:'',mobile:0,password:'',confirm:''})
  const dispatch = useDispatch();
  const error = useSelector(state=>state.auth.error);
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
        <Surface style={{width:width,height:height/1.5,backgroundColor:colors.LIGHT,position:'absolute',bottom:0,borderTopEndRadius:30,borderTopStartRadius:30,alignItems:'center'}} elevation={5}>
          <Hr styles={{height:2,marginVertical:18}}/>
          <Text variant='title_xl' style={{color:colors.DARK,textAlign:'center'}}>SIGN UP</Text>
          <View style={{width:'90%',padding:5}}>
            <TextInput
            onChangeText={val=>setUser({...user,email:val})}
            style={{marginTop:10}}
            inputMode='email'
            mode='outlined'
            activeOutlineColor={colors.INPUT_BORDER}
            outlineColor={colors.INPUT_BORDER}
            outlineStyle={{borderRadius:10}}
            placeholderTextColor={colors.PLACEHOLDER}
            textColor={colors.DARK}
            placeholder='Email'/>
            <TextInput
            onChangeText={val=>setUser({...user,mobile:val})}
            inputMode='tel'
            style={{marginTop:5}}
            mode='outlined'
            activeOutlineColor={colors.INPUT_BORDER}
            outlineColor={colors.INPUT_BORDER}
            outlineStyle={{borderRadius:10}}
            placeholderTextColor={colors.PLACEHOLDER}
            textColor={colors.DARK}
            placeholder='Mobile Number'/>
            <TextInput
            onChangeText={val=>setUser({...user,password:`${SHA1(val)}`})}
            secureTextEntry
            style={{marginTop:5}}
            mode='outlined'
            activeOutlineColor={colors.INPUT_BORDER}
            outlineColor={colors.INPUT_BORDER}
            outlineStyle={{borderRadius:10}}
            placeholderTextColor={colors.PLACEHOLDER}
            textColor={colors.DARK}
            placeholder='Password'/>
            <TextInput
            onChangeText={val=>setUser({...user,confirm:`${SHA1(val)}`})}
            secureTextEntry
            style={{marginTop:5}}
            mode='outlined'
            activeOutlineColor={colors.INPUT_BORDER}
            outlineColor={colors.INPUT_BORDER}
            outlineStyle={{borderRadius:10}}
            placeholderTextColor={colors.PLACEHOLDER}
            textColor={colors.DARK}
            placeholder='Conform Password'/>
          </View>
          {/* <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:10}}>
            <Hr styles={{height:1}}/>
            <Text style={{color:colors.PLACEHOLDER,fontSize:18,fontFamily:'SegoeUI-Bold',marginHorizontal:15}}>OR</Text>
            <Hr styles={{height:1}}/>
          </View> */}
          <View style={{rowGap:8,marginBottom:20,flexDirection:'column',alignItems:'center',marginTop:20}}>
            {/* <IconButton icon={GoogleIcon} size={50} onPress={()=>console.log('gg')} /> */}
            <Button contentStyle={{paddingHorizontal:13,paddingVertical:3}} labelStyle={{fontWeight:'bold',fontSize:20,color:colors.LIGHT,marginTop:13}} onPress={()=>dispatch(signUp({...user,...apiInfo('signUp')}))} mode='contained'>SIGN UP</Button>
          </View>
        </Surface>
      </View>
    </KeyboardAwareScrollView>
    
  )
}

export default SignUp