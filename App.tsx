import { Provider as StoreProvider } from 'react-redux'
import { configureFonts, Provider as PaperProvider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'
import { MD3LightTheme as DefaultTheme } from 'react-native-paper'
import { StatusBar } from 'react-native'
import store from 'src/store/store'
import Router from 'src/navigation/router'
import colors from 'src/constants/colors'
import fontStyle from 'src/constants/fonts'
import linking from 'src/utils/tools/linking'

const theme = {
  ...DefaultTheme,
  colors:{
    primary:colors.PRIMARY,
    // background:colors.PRIMARY,
    // surface:colors.PRIMARY,
    elevation: {
        level3: "rgb(255, 221, 177)",
    },
  },
  fonts:configureFonts({config:{...fontStyle}}),
  roundness:3.5,
  
  // "colors": {
  //   "primary": "rgb(129, 86, 0)",
  //   "onPrimary": "rgb(255, 255, 255)",
  //   "primaryContainer": "rgb(255, 221, 177)",
  //   "onPrimaryContainer": "rgb(41, 24, 0)",
  //   "secondary": "rgb(111, 91, 64)",
  //   "onSecondary": "rgb(255, 255, 255)",
  //   "secondaryContainer": "rgb(250, 222, 188)",
  //   "onSecondaryContainer": "rgb(39, 25, 4)",
  //   "tertiary": "rgb(80, 100, 64)",
  //   "onTertiary": "rgb(255, 255, 255)",
  //   "tertiaryContainer": "rgb(211, 234, 189)",
  //   "onTertiaryContainer": "rgb(15, 32, 4)",
  //   "error": "rgb(186, 26, 26)",
  //   "onError": "rgb(255, 255, 255)",
  //   "errorContainer": "rgb(255, 218, 214)",
  //   "onErrorContainer": "rgb(65, 0, 2)",
  //   "background": "rgb(255, 251, 255)",
  //   "onBackground": "rgb(31, 27, 22)",
  //   "surface": "rgb(255, 251, 255)",
  //   "onSurface": "rgb(31, 27, 22)",
  //   "surfaceVariant": "rgb(239, 224, 207)",
  //   "onSurfaceVariant": "rgb(79, 69, 57)",
  //   "outline": "rgb(129, 117, 103)",
  //   "outlineVariant": "rgb(211, 196, 180)",
  //   "shadow": "rgb(0, 0, 0)",
  //   "scrim": "rgb(0, 0, 0)",
  //   "inverseSurface": "rgb(52, 48, 42)",
  //   "inverseOnSurface": "rgb(249, 239, 231)",
  //   "inversePrimary": "rgb(255, 186, 73)",
  //   "elevation": {
  //     "level0": "transparent",
  //     "level1": "rgb(249, 243, 242)",
  //     "level2": "rgb(245, 238, 235)",
  //     "level3": "rgb(241, 233, 227)",
  //     "level4": "rgb(240, 231, 224)",
  //     "level5": "rgb(237, 228, 219)"
  //   },
  //   "surfaceDisabled": "rgba(31, 27, 22, 0.12)",
  //   "onSurfaceDisabled": "rgba(31, 27, 22, 0.38)",
  //   "backdrop": "rgba(56, 47, 36, 0.4)"
  // }
  
}

const App = () => {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer linking={linking}>
          <StatusBar barStyle='dark-content' backgroundColor={colors.LIGHT} />
          <Router/>
        </NavigationContainer>
      </PaperProvider>
    </StoreProvider>
  )
}

export default App
