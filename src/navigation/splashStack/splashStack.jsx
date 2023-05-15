import { createStackNavigator } from '@react-navigation/stack'
import { SplashScreen } from 'src/screens';

const Stack = createStackNavigator();

const splashStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name='splash' component={SplashScreen} />
    </Stack.Navigator>
  )
}

export default splashStack