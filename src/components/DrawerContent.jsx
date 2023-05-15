import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar , Text } from 'react-native-paper'
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native'
import { logOut } from 'src/store/authSlice/authService'
import { Dummy, Edit, LogOut } from 'src/assets/images'
import { apiInfo, width } from 'src/constants/info'
import colors from 'src/constants/colors'
import {Hr} from 'src/components'
import { resetAuthCache } from 'src/store/authSlice/authSlice'

const DrawerContent = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(state=>state.auth.currentUser)
  return (
      <View style={{flex:1}}>
        <DrawerContentScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{backgroundColor:colors.PRIMARY}}  {...props}>
          <View style={{height:100,flexDirection:'row',alignItems:'center',paddingHorizontal:20}}>
            <Avatar.Image source={user.profile != null ? {uri:user.profile} : Dummy} size={60} />
            <View style={{paddingHorizontal:10}}>
              <Text variant='drawerItem' numberOfLines={1} style={{color:colors.LIGHT,width:width*0.8-100}}>{user.first_name == "None" ? user.gmail == null ? user.email : user.gmail : user.last_name == "None" ? user.first_name : `${user.first_name} ${user.last_name}` }</Text>
              <Text variant='drawerEditProfile' onPress={()=>navigation.navigate('editProfile')} style={{paddingVertical:5,color:colors.DARK}}>EDIT PROFILE &nbsp;<Edit width={10} height={10}/></Text>
            </View>
          </View>
          <View style={{backgroundColor:colors.LIGHT,paddingVertical:15,paddingHorizontal:10}}>
            <DrawerItemList {...props}/>
            {/* <DrawerItem onPress={()=>console.log('j')} label={()=>(
                    <View style={{alignItems:'center',paddingLeft:5,flexDirection:'row'}}>
                      <View style={{height:10,paddingRight:15,justifyContent:'center'}}>
                        <LogOut width={25}/>
                      </View>
                      <Text variant='drawerItem' style={{color:colors.DRAWER_ITEM}}>DRIVER</Text>
                    </View>
                  )}/> */}
          </View>
        </DrawerContentScrollView>
        <View style={{marginBottom:40,paddingHorizontal:10}}>
          <View style={{width:'100%',alignItems:'center',paddingVertical:10}}>
            <Hr styles={{height:1,width:'85%'}} />
          </View>
          <DrawerItem onPress={()=>dispatch(logOut({
                  session_id:user.session_id,
                  user_id:user.user_id,
                  log_id:user.log_id,
                  ...apiInfo('logOut'),
                  })).then(()=>{
                    dispatch(resetAuthCache)
                    dispatch(resetAuthCache)
                  })} label={()=>(
                  <>
                    <View style={{alignItems:'center',paddingLeft:5,flexDirection:'row'}}>
                      <View style={{height:10,paddingRight:15,justifyContent:'center'}}>
                        <LogOut width={25}/>
                      </View>
                      <Text variant='drawerItem' style={{color:colors.DARK}}>LOG OUT</Text>
                    </View>
                  </>
                )}/>
        </View>
      </View>
  )
}

export default DrawerContent