// PendingActivities.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import PostPendingActivities from '../components/PostPendingActivities';
import NoPendingRequests from '../components/NoPendingRequests';
import { useNavigation } from '@react-navigation/native';
import apiInstance from '../config/apiConfig';
import socket from '../config/socketConfig';

export default function PendingActivities() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('All Requests');
  const [pendingActivities, setPendingActivities] = useState([]);
  const [showNoPendingRequests, setShowNoPendingRequests] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial HTTP fetch
  useEffect(() => {
    const fetchPendingActivities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setShowNoPendingRequests(false);
        const pendingRequestsResponse = await apiInstance.get('/getPendingRequests');
        console.log('Full API Response:', pendingRequestsResponse.data);
        if (pendingRequestsResponse.data.hasPending) {
          const formattedActivities = pendingRequestsResponse.data.data.map(activity => ({
            id: activity.id,
            images: activity.images,
            activityTitle: activity.activityTitle,
            createdAt: activity.createdAt,
          }));
          setPendingActivities(formattedActivities);
          setShowNoPendingRequests(false);
        } else {
          setPendingActivities([]);
          setShowNoPendingRequests(true);
        }
      } catch (error) {
        setError(error);
        if (!error.response) {
          Alert.alert('Network Error', 'Failed to connect to server');
        } else {
          Alert.alert('Error', 'Failed to load pending activities');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchPendingActivities();
  }, []);

  // Realtime updates for Pending activities
  useEffect(() => {
    socket.on('adminPendingUpdate', (data) => {
      console.log("Realtime pending update received:", data);
      if (data && data.success && data.data) {
        if (data.data.length > 0) {
          setPendingActivities(data.data);
          setShowNoPendingRequests(false);
        } else {
          setPendingActivities([]);
          setShowNoPendingRequests(true);
        }
      }
    });
    return () => {
      socket.off('adminPendingUpdate');
    };
  }, []);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });
    return `${formattedDate} | ${formattedTime}`;
  };

  const handlePostPress = (index) => {
    const selectedActivity = pendingActivities[index];
    navigation.navigate("AdminActivityDetails", {
      activityId: selectedActivity.id,
    });
  };

  const renderActivitiesByTab = () => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    switch (activeTab) {
      case 'All Requests':
        return pendingActivities;
      case 'Newest Requests':
        return pendingActivities.filter(activity =>
          new Date(activity.createdAt) > twentyFourHoursAgo
        );
      case 'Oldest Requests':
        return pendingActivities.filter(activity =>
          new Date(activity.createdAt) <= twentyFourHoursAgo
        );
      default:
        return pendingActivities;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5A5F" />
        <Text style={styles.loadingText}>Loading Pending Activities...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load activities</Text>
        <Text style={styles.errorSubtext}>
          Please check your connection and try again
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => setError(null)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.welcomeText}>Welcome, Admin!</Text>
      <View style={styles.block}>
        <Text style={styles.reservationsText}>Pending Activity Requests</Text>
        <ScrollView
          horizontal
          style={styles.tabsContainer}
          showsHorizontalScrollIndicator={false}
        >
          {['All Requests', 'Newest Requests', 'Oldest Requests'].map(tabName => (
            <TouchableOpacity
              key={tabName}
              style={[styles.tab, activeTab === tabName && styles.activeTab]}
              onPress={() => setActiveTab(tabName)}
            >
              <Text style={activeTab === tabName ? styles.tabTextActive : styles.tabText}>
                {tabName} (
                {tabName === 'All Requests'
                  ? pendingActivities.length
                  : pendingActivities.filter(activity =>
                    tabName === 'Newest Requests'
                      ? new Date(activity.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                      : new Date(activity.createdAt) <= new Date(Date.now() - 24 * 60 * 60 * 1000)
                  ).length}
                )
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {showNoPendingRequests ? (
          <NoPendingRequests activeTab={activeTab} />
        ) : (
          renderActivitiesByTab().map((activity, index) => (
            <PostPendingActivities
              key={activity.id}
              PostImages={activity.images.map(imageUrl => ({ uri: imageUrl }))}
              PostCaption={activity.activityTitle}
              PostTime={formatDateTime(activity.createdAt)}
              onPress={() => handlePostPress(index)}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  welcomeText: {
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
  block: {
    marginHorizontal: 22,
  },
  reservationsText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 15,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  tab: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: 'white',
    marginRight: 10,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  activeTab: {
    borderColor: '#000000',
    borderWidth: 1,
  },
  tabText: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#FF5A5F',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  errorText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff0000',
    marginBottom: 10,
  },
  errorSubtext: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});
