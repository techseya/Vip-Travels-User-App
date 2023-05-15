import { View, Image } from 'react-native'
import { Splash } from 'src/assets/images'
import colors from 'src/constants/colors'
import { width } from 'src/constants/info'

const SplashScreen = () => {
  return (
    <View style={{flex:1,backgroundColor:colors.DARK,justifyContent:'center'}}>
        <Image resizeMode='contain' style={{width:width,height:width}} source={Splash} />
    </View>
  )
}

export default SplashScreen