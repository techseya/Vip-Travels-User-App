import { useNavigation } from '@react-navigation/native'
import { View } from 'react-native'
import { ActivityIndicator, Avatar , Button, Modal, Portal, Text } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { Taxi } from 'src/assets/images'
import colors from 'src/constants/colors'
import { width } from 'src/constants/info'

const GetStarted = () => {
  const isLoading = useSelector(state=>state.auth.isLoading);
  const navigation = useNavigation();
  return (
    <View style={{flex:1,backgroundColor:colors.LIGHT,alignItems:'center'}}>
      <Portal>
        <Modal contentContainerStyle={{backgroundColor:colors.BACKDROP,flex:1}} visible={isLoading}>
          <ActivityIndicator animating={true} size={40}/>
        </Modal>
      </Portal>
      <Avatar.Image 
      style={{justifyContent:'center',alignItems:'center',marginTop:30,backgroundColor:colors.LIGHT,elevation:6}} 
      size={width*.8} 
      source={()=>(<Taxi width={width*.5} height={width*.5} />)} />
      <Text variant='title_xxl' style={{color:colors.DARK,textAlign:'center',marginTop:40}} numberOfLines={2}>WELCOME</Text>
      <View style={{position:'absolute',bottom:30}}>
        <View style={{flexDirection:'row',justifyContent:"center",columnGap:10}}>
          <Button 
          contentStyle={{paddingHorizontal:13,paddingVertical:3}} 
          labelStyle={{fontWeight:'bold',fontSize:20,color:colors.LIGHT,marginTop:13}} 
          onPress={()=>navigation.navigate('login')} 
          mode='contained'>SIGN IN</Button>
          <Button 
          contentStyle={{paddingHorizontal:13,paddingVertical:3}} 
          labelStyle={{fontWeight:'bold',fontSize:20,color:colors.LIGHT,marginTop:13}} 
          onPress={()=>navigation.navigate('signUp')} 
          mode='contained'>SIGN UP</Button>
        </View>
        <Text variant='small' style={{color:colors.GRAY,textAlign:'center',marginTop:10}}>By Proceeding You Accept Our Teams and Conditions</Text>
      </View>
    </View>
  )
}

export default GetStarted