import { View } from 'react-native'
import colors from 'src/constants/colors'

const Hr = ({styles}) => {
  return (
    <View style={{backgroundColor:colors.DARK,width:60,...styles}}/>
  )
}

export default Hr