import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import apiInstance from '../config/apiConfig';
import PostActivity from '../components/PostActivity';
import NoAcceptedActivity from '../components/NoAcceptedActivity';  


export default function AcceptedActivities() {    
  const navigation = useNavigation();    
  const [activities, setActivities] = useState([]);    
  const [loading, setLoading] = useState(true); // Track loading state      
 
  // Using useFocusEffect instead of useEffect
  useFocusEffect(
    useCallback(() => {
      fetchAcceptedActivities();
      return () => {
        // Cleanup function if needed
      };
    }, [])
  );      
 
  const fetchAcceptedActivities = async () => {        
    try {            
      const response = await apiInstance.get('/fetchAllAcceptedActivities');            
      setActivities(response.data.data); // Update activities state        
    } catch (error) {            
      if (!error.response) {              
        Alert.alert('Network Error', 'Check internet connection');            
      } else {              
        Alert.alert('Error', 'Failed to load activities');            
      }            
      setActivities([]);          
    } finally {            
      setLoading(false); // Ensure loading is set to false        
    }    
  };      
 
  const handlePress = (activityId) => {        
    navigation.navigate('AcceptedActivityDetails', { activityId });    
  };      
 
  // Group activities into rows of 2
  const groupedData = [];    
  for (let i = 0; i < activities.length; i += 2) {        
    groupedData.push(activities.slice(i, i + 2)); // Group data into rows of 2 items    
  }      
 
  return (        
    <View style={styles.container}>            
      {!loading && activities.length === 0 ? (                
        <NoAcceptedActivity />            
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
          ListHeaderComponent={<Text style={styles.headerText}>Accepted</Text>}                    
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
    marginBottom: -6,  // Your specific spacing between rows
    width: '100%',     // Ensure row takes full width    
  },    
  item: {        
    width: '46%',  // Slightly narrower to create more space between items
  },
  itemPlaceholder: {
    width: '46%',  // Same width as real items
  }
});