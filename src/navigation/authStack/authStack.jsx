import { createStackNavigator } from '@react-navigation/stack'
import { GetStarted , Login , SignUp } from "src/screens"

const Stack = createStackNavigator();

const authStack = ()=>{
    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="getStarted" component={GetStarted} />
            <Stack.Screen name="signUp" component={SignUp} />
            <Stack.Screen name="login" component={Login} />
        </Stack.Navigator>
    )
}

export default authStack;