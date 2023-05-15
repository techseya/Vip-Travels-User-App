import React from 'react';
import {View} from 'react-native';
import {
  Avatar,
  Button,
  IconButton,
  Chip,
  ProgressBar,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import {TitleHeader} from 'src/components';
import colors from 'src/constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome';
import objectToStringList from 'src/utils/helpers/objectToStringList';
import {useDispatch, useSelector} from 'react-redux';
import {apiInfo} from 'src/constants/info';
import {reviewHire} from 'src/store/appSlice/appService';
import { resetHireRideData, setScreen } from 'src/store/appSlice/appSlice';

const HireRideReview = ({route, navigation}) => {
  const dispatch = useDispatch();
  const app = useSelector(state => state.app);
  const user = useSelector(state => state.auth.currentUser);

  const [activeRating, setActiveRating] = React.useState(0);
  const [issueList, setIssueList] = React.useState({
    Cleanliness: false,
    Nevigation: false,
    Pick_Up: false,
    Driving_Ability: false,
    Service_Quality: false,
    Price: false,
    Other: false,
  });

  return (
    <View style={{flex: 1, backgroundColor: colors.LIGHT}}>
      <TitleHeader
        navMode="stateBack"
        navBgColor={colors.PRIMARY}
        headerTitle="Rating"
      />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          paddingVertical: 20,
          justifyContent: 'space-between',
        }}>
        <View style={{alignItems: 'center', gap: 10}}>
          <Avatar.Image
            size={70}
            source={
              route.params.driverData != null
                ? {uri: route.params.driverData.model_cover}
                : require('../../assets/images/cars/c2.png')
            }
          />
          <View style={{flexDirection: 'row'}}>
            <IconButton
              onPress={() => {
                activeRating == 1 ? setActiveRating(0) : setActiveRating(1);
              }}
              icon={() => (
                <Icon
                  name={activeRating >= 1 ? 'star' : 'star-o'}
                  size={25}
                  color={colors.PRIMARY}
                />
              )}
            />
            <IconButton
              onPress={() => {
                activeRating == 5 ? setActiveRating(1) : setActiveRating(2);
              }}
              icon={() => (
                <Icon
                  name={activeRating >= 2 ? 'star' : 'star-o'}
                  size={25}
                  color={colors.PRIMARY}
                />
              )}
            />
            <IconButton
              onPress={() => {
                activeRating == 5 ? setActiveRating(2) : setActiveRating(3);
              }}
              icon={() => (
                <Icon
                  name={activeRating >= 3 ? 'star' : 'star-o'}
                  size={25}
                  color={colors.PRIMARY}
                />
              )}
            />
            <IconButton
              onPress={() => {
                activeRating == 5 ? setActiveRating(3) : setActiveRating(4);
              }}
              icon={() => (
                <Icon
                  name={activeRating >= 4 ? 'star' : 'star-o'}
                  size={25}
                  color={colors.PRIMARY}
                />
              )}
            />
            <IconButton
              onPress={() => {
                activeRating == 5 ? setActiveRating(4) : setActiveRating(5);
              }}
              icon={() => (
                <Icon
                  name={activeRating >= 5 ? 'star' : 'star-o'}
                  size={25}
                  color={colors.PRIMARY}
                />
              )}
            />
          </View>
          <Text variant="bold" style={{color: colors.DARK}}>
            Okay, but had an issue
          </Text>

          <View style={{flexDirection: 'row', gap: 5}}>
            <Chip
              onPress={() =>
                setIssueList({
                  ...issueList,
                  Cleanliness: !issueList.Cleanliness,
                })
              }
              mode="outlined"
              showSelectedOverlay
              selected={issueList.Cleanliness}
              compact={true}
              style={{backgroundColor: colors.LIGHT}}
              selectedColor={colors.DARK}
              textStyle={{color: colors.DARK}}>
              Cleanliness
            </Chip>
            <Chip
              onPress={() =>
                setIssueList({...issueList, Nevigation: !issueList.Nevigation})
              }
              mode="outlined"
              showSelectedOverlay
              selected={issueList.Nevigation}
              compact={true}
              style={{backgroundColor: colors.LIGHT}}
              selectedColor={colors.DARK}
              textStyle={{color: colors.DARK}}>
              Nevigation
            </Chip>
            <Chip
              onPress={() =>
                setIssueList({...issueList, Pick_Up: !issueList.Pick_Up})
              }
              mode="outlined"
              showSelectedOverlay
              selected={issueList.Pick_Up}
              compact={true}
              style={{backgroundColor: colors.LIGHT}}
              selectedColor={colors.DARK}
              textStyle={{color: colors.DARK}}>
              Pick Up
            </Chip>
          </View>
          <View style={{flexDirection: 'row', gap: 5}}>
            <Chip
              onPress={() =>
                setIssueList({
                  ...issueList,
                  Driving_Ability: !issueList.Driving_Ability,
                })
              }
              mode="outlined"
              showSelectedOverlay
              selected={issueList.Driving_Ability}
              compact={true}
              style={{backgroundColor: colors.LIGHT}}
              selectedColor={colors.DARK}
              textStyle={{color: colors.DARK}}>
              Driving Ability
            </Chip>
            <Chip
              onPress={() =>
                setIssueList({
                  ...issueList,
                  Service_Quality: !issueList.Service_Quality,
                })
              }
              mode="outlined"
              showSelectedOverlay
              selected={issueList.Service_Quality}
              compact={true}
              style={{backgroundColor: colors.LIGHT}}
              selectedColor={colors.DARK}
              textStyle={{color: colors.DARK}}>
              Service Quality
            </Chip>
          </View>
          <View style={{flexDirection: 'row', gap: 5}}>
            <Chip
              onPress={() =>
                setIssueList({...issueList, Price: !issueList.Price})
              }
              mode="outlined"
              showSelectedOverlay
              selected={issueList.Price}
              compact={true}
              style={{backgroundColor: colors.LIGHT}}
              selectedColor={colors.DARK}
              textStyle={{color: colors.DARK}}>
              Price
            </Chip>
            <Chip
              onPress={() =>
                setIssueList({...issueList, Other: !issueList.Other})
              }
              mode="outlined"
              showSelectedOverlay
              selected={issueList.Other}
              compact={true}
              style={{backgroundColor: colors.LIGHT}}
              selectedColor={colors.DARK}
              textStyle={{color: colors.DARK}}>
              Other
            </Chip>
          </View>

          <Text variant="medium" style={{color: colors.GRAY}}>
            Please, select one or more Issue
          </Text>
        </View>
        <View style={{width: '70%'}}>
          <Button
            contentStyle={{paddingHorizontal: 13, paddingVertical: 3}}
            labelStyle={{
              fontWeight: 'bold',
              fontSize: 20,
              color: colors.LIGHT,
            }}
            mode="contained"
            onPress={() => {
              dispatch(
                reviewHire({
                  ...apiInfo('ride'),
                  hire_id: route.params.hire_id,
                  user_id: user.id,
                  rate: activeRating,
                  review: objectToStringList(issueList),
                }),
              ).then(res => {
                console.log('review res',res.payload);
                if (res.payload != undefined) {
                  if (res.payload.result) {
                    dispatch(resetHireRideData())
                     dispatch(setScreen(null))
                  }
                }
              });
            }}>
            DONE
          </Button>
        </View>
      </View>
    </View>
  );
};

export default HireRideReview;
