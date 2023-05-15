import { View } from 'react-native'
import { DrawerActions } from "@react-navigation/native"
import colors from 'src/constants/colors'
import Icon from 'react-native-vector-icons/Feather'
import { Avatar, IconButton } from 'react-native-paper'
import { useSelector } from 'react-redux'
import { Dummy } from 'src/assets/images'

const DrawerHeader = ({navigation}) => {
  const user = useSelector(state=>state.auth.currentUser)
  return (
    <View style={{height:60,paddingHorizontal:20,backgroundColor:colors.LIGHT,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <IconButton onPress={()=>navigation.dispatch(DrawerActions.toggleDrawer())} icon={()=>(<Icon name='menu' size={35} color={colors.DARK} />)} />
        <Avatar.Image size={50} source={user.profile != null ? {uri:user.profile} : Dummy} />
    </View>
  )
}

export default DrawerHeader