// RejectedActivities.js
import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import apiInstance from '../config/apiConfig';
import PostActivity from '../components/PostActivity';
import NoRejectedActivity from '../components/NoRejectedActivity';

export default function RejectedActivities() {
  const navigation = useNavigation();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial HTTP fetch - changed to useFocusEffect
  useFocusEffect(
    useCallback(() => {
      const fetchRejectedActivities = async () => {
        try {
          setLoading(true);
          const response = await apiInstance.get('/fetchAllRejectedActivities');
          setActivities(response.data.data);
        } catch (error) {
          if (!error.response) {
            Alert.alert('Network Error', 'Check internet connection');
          } else {
            Alert.alert('Error', 'Failed to load activities');
          }
          setActivities([]);
        } finally {
          setLoading(false);
        }
      };
      fetchRejectedActivities();
      
      return () => {
        // Cleanup function if needed
      };
    }, [])
  );

  const handlePress = (activityId) => {
    navigation.navigate('RejectedActivityDetails', { activityId });
  };


  // Group activities into rows of 2
  const groupedData = [];
  for (let i = 0; i < activities.length; i += 2) {
    groupedData.push(activities.slice(i, i + 2));
  }


  return (
    <View style={styles.container}>
      {!loading && activities.length === 0 ? (
        <NoRejectedActivity />
      ) : (
        <FlatList
          data={groupedData}
          renderItem={({ item }) => (
            <View style={styles.row}>
              {item.map((activity) => (
                <View
                  key={activity.id}
                  style={styles.item}
                >
                  <PostActivity
                    image={{ uri: activity.image }}
                    caption={activity.activityTitle}
                    onPress={() => handlePress(activity.id)}
                  />
                </View>
              ))}
              {/* Add placeholder view when there's only one item in the row */}
              {item.length === 1 && <View style={styles.itemPlaceholder} />}
            </View>
          )}
          keyExtractor={(item, index) => `row-${index}`}
          ListHeaderComponent={<Text style={styles.headerText}>Rejected</Text>}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={true}
          scrollEnabled={true}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 38,
    fontWeight: '600',
    color: 'black',
    marginVertical: 20,
    textAlign: 'left',
    marginLeft: 2,
    marginTop: 65,
    marginBottom: 25,
    letterSpacing: 0.6,
  },
  listContainer: {
    paddingHorizontal: 28,  // Increased padding for more space on edges
    paddingBottom: 120,     // Added padding at bottom for scrolling
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Changed to space-between for equal distribution
    marginBottom: -6,      // Your specific spacing between rows
    width: '100%',         // Ensure row takes full width
  },
  item: {
    width: '46%',         // Slightly narrower to create more space between items
  },
  itemPlaceholder: {
    width: '46%',         // Same width as real items
  }
});