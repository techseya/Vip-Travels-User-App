import { createStackNavigator } from '@react-navigation/stack'
import { Welcome } from 'src/screens';

const Stack = createStackNavigator();

const walkthroughStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name='welcome' component={Welcome} />
    </Stack.Navigator>
  )
}

export default walkthroughStack