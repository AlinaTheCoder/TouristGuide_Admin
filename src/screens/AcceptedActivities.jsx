import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import apiInstance from '../config/apiConfig';
import PostActivity from '../components/PostActivity';
import NoAcceptedActivity from '../components/NoAcceptedActivity';


export default function AcceptedActivities() {
    const navigation = useNavigation();
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true); // Track loading state


    useEffect(() => {
        fetchAcceptedActivities();
    }, []);


    const fetchAcceptedActivities = async () => {
        try {
            const response = await apiInstance.get('/fetchAllAcceptedActivities');
            setActivities(response.data.data); // Update activities state
        } catch (error) {
            console.error('Error fetching activities:', error);
            setActivities([]); // Reset to empty on error
        } finally {
            setLoading(false); // Ensure loading is set to false
        }
    };


    const handlePress = (activityId) => {
        navigation.navigate('AcceptedActivityDetails', { activityId });
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
        groupedData.push(activities.slice(i, i + 2)); // Group data into rows of 2 items
    }


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF5A5F" />
                <Text style={styles.loadingText}>Loading Accepted Activities...</Text>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            {activities.length === 0 ? (
                <NoAcceptedActivity />
            ) : (
                <FlatList
                    data={groupedData}
                    renderItem={({ item }) => renderRow(item)}
                    keyExtractor={(item, index) => `row-${index}`}
                    ListHeaderComponent={<Text style={styles.headerText}>Accepted</Text>}
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
        maxWidth: '48%', // Ensures proper spacing between columns
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
});



