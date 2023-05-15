import React from 'react';
import {View} from 'react-native';
import {ProgressBar,Text} from 'react-native-paper';
import colors from 'src/constants/colors';

const Help = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const updateProgress = () => {
      setProgress(currentProgress => {
        if (currentProgress < 1) {
          setTimeout(updateProgress, 300);
        }else{
          // progress complete
          setProgress(0);
          updateProgress();
        }
        return currentProgress + 0.01;
      });
    };
    updateProgress();
  }, []);

  return (
    <View>
      <Text>Help</Text>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color:colors.DARK}}>Loading...</Text>
        <View style={{width: '80%'}}>
          <ProgressBar
            progress={progress}
            color={colors.PRIMARY}
            style={{height: 10, borderRadius: 10,borderWidth:0.1}}
          />
        </View>
      </View>
    </View>
  );
};

export default Help;
