// inside the components folder
import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const NoPendingRequests = ({ activeTab }) => {
    const getReservationText = () => {
        switch (activeTab) {
            case 'All Requests':
                return "You don't have any pending activity requests.";
            case 'Oldest Requests':
                return "You don't have any oldest requests right now.";
            case 'Newest Requests':
                return "You don't have any newest requests right now.";
            default:
                return "You don't have any pending activity requests.";
        }
    };

    return (
        <View style={styles.noReservationContainer}>
            <Text style={styles.noReservationText}>{getReservationText()}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    noReservationContainer: {
        backgroundColor: '#f2f2f2',
        borderRadius: 12,
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20,
        minHeight: height * 0.4,
    },
    noReservationText: {
        color: '#888888',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        marginHorizontal: 40,
        lineHeight: 16
    },
});

export default NoPendingRequests;