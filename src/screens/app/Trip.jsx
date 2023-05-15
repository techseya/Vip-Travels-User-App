import React from 'react';
import {View, FlatList} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {Loading, LocationListItem} from 'src/components';
import colors from 'src/constants/colors';
import {apiInfo} from 'src/constants/info';
import {getTripHistory} from 'src/store/appSlice/appService';
import {resetTripHistory} from 'src/store/appSlice/appSlice';

const Trip = () => {
  const dispatch = useDispatch();
  const app = useSelector(state => state.app);
  const user = useSelector(state => state.auth.currentUser);

  const [up, setUp] = React.useState(0);
  const [offUp, setOffUp] = React.useState(false);

  React.useEffect(() => {
    if (!offUp) {
      if (up == 0) {
        dispatch(resetTripHistory());
      }
      dispatch(
        getTripHistory({
          ...apiInfo('trip'),
          user_id: user.id,
          row_count: 20,
          up: up,
        }),
      ).then(res =>
        res.payload != undefined
          ? res.payload.result == false
            ? setOffUp(true)
            : null
          : null,
      );
    }
  }, [up]);

  return (
    <View style={{flex: 1, backgroundColor: colors.LIGHT}}>
      {app.tripHistory == null ? (
        <Loading />
      ) : app.tripHistory == false ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text variant="bold" style={{color: colors.DARK}}>
            No Trip History
          </Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{
            gap: 10,
            paddingHorizontal: 15,
            paddingVertical: 15,
          }}
          onEndReached={() => (offUp ? {} : setUp(up + 20))}
          onEndReachedThreshold={0}
          ListFooterComponent={() => (
            <View>
              {app.isLoading ? (
                <ActivityIndicator
                  animating={true}
                  size={40}
                  color={colors.PRIMARY}
                />
              ) : null}
            </View>
          )}
          data={[...app.tripHistory]}
          renderItem={props => <LocationListItem {...props} />}
        />
      )}
    </View>
  );
};

export default Trip;
