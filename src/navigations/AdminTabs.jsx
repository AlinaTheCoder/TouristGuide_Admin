import React from 'react';
import { Image, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PendingActivities from '../screens/PendingActivities';
import AcceptedActivities from '../screens/AcceptedActivities';
import RejectedActivities from '../screens/RejectedActivities';

const Tab = createBottomTabNavigator();

const AdminTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          left: 20,
          right: 20,
          height: 80,
          backgroundColor: '#FFFFFF',
          paddingLeft: 10,
          paddingRight: 10,
          elevation: 10
        },
      }}
    >
      <Tab.Screen
        name="PendingActivities"
        component={PendingActivities}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 22, width: 60 }}>
              <Image
                source={require('../icons/pending.png')}
                resizeMode="contain"
                style={{
                  width: 26,
                  height: 26,
                  marginBottom: 4,
                  tintColor: focused ? '#E74C3C' : '#555'
                }}
              />
              <Text style={{ color: focused ? '#E74C3C' : '#555', fontSize: 13, marginTop: 3, letterSpacing: 0.5, }}>Pending</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="AcceptedActivities"
        component={AcceptedActivities}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 22, width: 70 }}>
              <Image
                source={require('../icons/accepted.png')}
                resizeMode="contain"
                style={{
                  width: 26,
                  height: 26,
                  marginBottom: 4,
                  tintColor: focused ? '#E74C3C' : '#555'
                }}
              />
              <Text style={{ color: focused ? '#E74C3C' : '#555', fontSize: 13, marginTop: 3, letterSpacing: 0.5 }}>Accepted</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Rejected"
        component={RejectedActivities}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: 23, width: 60 }}>
              <Image
                source={require('../icons/declined.png')}
                resizeMode="contain"
                style={{
                  width: 26,
                  height: 26,
                  marginBottom: 4,
                  tintColor: focused ? '#E74C3C' : '#555'
                }}
              />
              <Text style={{ color: focused ? '#E74C3C' : '#555', fontSize: 13, marginTop: 3, letterSpacing: 0.5 }}>Rejected</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default AdminTabs;