import Icon from 'react-native-vector-icons/Ionicons'
import { IconButton } from 'react-native-paper'
import colors from 'src/constants/colors'

const BackButton = ({_goBack}) => {
  return (
    <IconButton 
    onPress={()=>_goBack()} 
    style={{position:'absolute',left:5,top:5,zIndex:999}} 
    containerColor={colors.LIGHT} 
    icon={()=>(<Icon name="chevron-back" size={35} color={colors.DARK} />)}
    />
  )
}

export default BackButton