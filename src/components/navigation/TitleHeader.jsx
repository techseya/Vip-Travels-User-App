import {View} from 'react-native';
import {IconButton, Text} from 'react-native-paper';
import IIcon from 'react-native-vector-icons/Ionicons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import colors from 'src/constants/colors';
import { useDispatch } from 'react-redux';
import { resetHireRideData, setScreen } from 'src/store/appSlice/appSlice';


export default ({navMode, navBgColor,headerTitle}) => {
  const dispatch = useDispatch();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 10,
        backgroundColor:
          navBgColor == undefined ? colors.LIGHT : navBgColor,
      }}>
      <IconButton
        onPress={() =>{
            if(navMode == 'sideNav'){
              props.navigation.toggleDrawer()
            }else if( navMode == 'stateBack'){
              dispatch(resetHireRideData())
              dispatch(setScreen(null))
            }else{
              props.navigation.goBack()
            }
        }
        }
        icon={() =>
          navMode == 'sideNav' ? (
            <FIcon
              name="navicon"
              size={30}
              style={{color: colors.DARK}}
            />
          ) : navMode == 'back' ? (
            <IIcon
              name={
                navBgColor == colors.PRIMARY
                  ? 'arrow-back'
                  : 'chevron-back'
              }
              size={navBgColor == colors.PRIMARY ? 30 : 35}
              style={{
                color:
                  navBgColor == colors.PRIMARY
                    ? colors.LIGHT
                    : colors.DARK,
              }}
            />
          )  : navMode == 'stateBack' ? (
            <IIcon
              name={
                navBgColor == colors.PRIMARY
                  ? 'chevron-back'
                  : 'arrow-back'
              }
              size={navBgColor == colors.PRIMARY ? 30 : 35}
              style={{
                color:
                  navBgColor == colors.PRIMARY
                    ? colors.DARK
                    : colors.LIGHT,
              }}
            />
          )  : null
        }
      />
      <Text variant="bold" style={{fontSize: 22, color: colors.LIGHT}}>
        {headerTitle}
      </Text>
    </View>
  );
};
