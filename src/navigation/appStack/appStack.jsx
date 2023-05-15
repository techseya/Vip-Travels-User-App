import {createDrawerNavigator} from '@react-navigation/drawer';
import {
  EditProfile,
  Help,
  HireRide,
  HireRideReview,
  Home,
  RentCar,
  RentCarConfirm,
  Trip,
  WeddingCar,
  WeddingCarConfirm,
} from 'src/screens';
import {DrawerContent, DrawerHeader} from 'src/components';
import {width} from 'src/constants/info';
import Route from 'src/constants/routes';
import colors from 'src/constants/colors';
import font from 'src/constants/fonts';
import {createStackNavigator} from '@react-navigation/stack';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerNav = () => {
  return (
    <>
      <Drawer.Navigator
        screenOptions={{
          header: ({navigation}) => <DrawerHeader navigation={navigation} />,
          drawerStyle: {width: width * 0.8},
          drawerActiveTintColor: colors.DARK,
          drawerActiveBackgroundColor: colors.LIGHT,
          drawerItemStyle: {height: 40, justifyContent: 'center'},
          drawerLabelStyle: {
            marginLeft: -10,
            ...font.drawerItem,
            textTransform: 'uppercase',
          },
        }}
        drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen
          options={{drawerIcon: () => <Route.HOME.icon width={25} />}}
          name={Route.HOME.name}
          component={Home}
        />
        <Drawer.Screen
          options={{drawerIcon: () => <Route.TRIP.icon width={25} />}}
          name={Route.TRIP.name}
          component={Trip}
        />
        {/* <Drawer.Screen options={{drawerIcon:()=>(<Route.HELP.icon width={25}/>)}} name={Route.HELP.name} component={Help}/> */}
        {/* <Drawer.Screen options={{drawerIcon:()=>(<Route.SETTING.icon width={25}/>)}} name={Route.SETTING.name} component={Setting}/> */}
        {/* <Drawer.Screen options={{drawerIcon:()=>(<Route.ABOUT.icon width={25}/>)}} name={Route.ABOUT.name} component={About}/> */}
      </Drawer.Navigator>
    </>
  );
};

const appStack = screens => {
  return (
    <>
      {screens == null ? (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="drawer" component={DrawerNav} />
          <Stack.Screen name="editProfile" component={EditProfile} />
          <Stack.Screen name="rentCar" component={RentCar} />
          <Stack.Screen name="rentCarConfirm" component={RentCarConfirm} />
          <Stack.Screen name="weddingCar" component={WeddingCar} />
          <Stack.Screen
            name="weddingCarConfirm"
            component={WeddingCarConfirm}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="hireRide" component={HireRide} />
          <Stack.Screen name="hireRideReview" component={HireRideReview} />
        </Stack.Navigator>
      )}
    </>
  );
};

export default appStack;
