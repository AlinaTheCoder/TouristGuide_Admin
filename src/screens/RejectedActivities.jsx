// RejectedActivities.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator,Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import apiInstance from '../config/apiConfig';
import PostActivity from '../components/PostActivity';
import NoRejectedActivity from '../components/NoRejectedActivity';
import socket from '../config/socketConfig';

export default function RejectedActivities() {
  const navigation = useNavigation();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial HTTP fetch
  useEffect(() => {
    const fetchRejectedActivities = async () => {
      try {
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
  }, []);

  // Realtime updates for rejected activities
  useEffect(() => {
    socket.on('adminRejectedUpdate', (data) => {
      console.log("Realtime rejected update received:", data);
      if (data && data.success && data.data) {
        setActivities(data.data);
      }
    });
    return () => {
      socket.off('adminRejectedUpdate');
    };
  }, []);

  const handlePress = (activityId) => {
    navigation.navigate('RejectedActivityDetails', { activityId });
  };

  const renderRow = (items) => (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item.id} style={styles.item}>
          <PostActivity
            image={{ uri: item.image }}
            caption={item.activityTitle}
            onPress={() => handlePress(item.id)}
          />
        </View>
      ))}
    </View>
  );

  const groupedData = [];
  for (let i = 0; i < activities.length; i += 2) {
    groupedData.push(activities.slice(i, i + 2));
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5A5F" />
        <Text style={styles.loadingText}>Loading Rejected Activities...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {activities.length === 0 ? (
        <NoRejectedActivity />
      ) : (
        <FlatList
          data={groupedData}
          renderItem={({ item }) => renderRow(item)}
          keyExtractor={(item, index) => `row-${index}`}
          ListHeaderComponent={<Text style={styles.headerText}>Rejected</Text>}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
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
    marginLeft: 20,
    marginTop: 65,
    marginBottom: 25,
    letterSpacing: 0.6,
  },
  listContainer: {
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  item: {
    flex: 1,
    marginHorizontal: 10,
    maxWidth: '48%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#FF5A5F',
  },
});
