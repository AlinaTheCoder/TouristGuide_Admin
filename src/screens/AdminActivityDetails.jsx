import React, { useState, useEffect } from "react";
import {
    View,
    FlatList,
    Image,
    StyleSheet,
    Dimensions,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,

} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import apiInstance from "../config/apiConfig";

const screenWidth = Dimensions.get("window").width;

const AdminActivityDetails = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const { activityId } = route.params;

    const [activityData, setActivityData] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hostName, setHostName] = useState("");

    // Fetch activity details and host name
    useEffect(() => {
        const fetchActivityDetails = async () => {
            try {
                setLoading(true);

                // Fetch activity details from API
                const response = await apiInstance.get(`/activityDetails/${activityId}`);
                if (response.data.success) {
                    setActivityData(response.data.data);
                } else {
                    throw new Error("Failed to fetch activity details");
                }
            } catch (err) {
                setError(err.message);
                Alert.alert('Error', 'Failed to load activity details');
              } finally {
                setLoading(false);
            }
        };

        fetchActivityDetails();
    }, [activityId]);

    const handleAccept = async () => {
        try {
            // Call the backend API to accept the activity
            const response = await apiInstance.post(`/acceptActivity/${activityId}`);
            if (response.data.success) {
                Alert.alert('Success', 'Activity successfully accepted!');
                navigation.goBack(); // Navigate back to the previous screen
            } else {
                Alert.alert('Error', response.data.message || 'Failed to accept activity');
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            Alert.alert('Error', message || 'Accept failed');
          }
    };

    const handleRejectActivity = async () => {
        try {
            console.log('Reject button clicked');
            // Call the backend API to reject the activity
            const response = await apiInstance.post(`/rejectActivity/${activityId}`);
            if (response.data.success) {
                Alert.alert('Success', 'Activity has been rejected');
                navigation.goBack(); // Navigate back to the pending activities list
            } else {
                Alert.alert('Error', 'Failed to reject activity');
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            Alert.alert('Error', message || 'Reject failed');
          }
    };


    const formatDate = (dateString) => {
        const options = { month: "short", day: "numeric", year: "numeric" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    const formatTime = (timeString) => {
        const options = { hour: "numeric", minute: "numeric", hour12: true };
        return new Date(timeString).toLocaleTimeString("en-US", options).toUpperCase();
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const renderItem = ({ item }) => (
        <View>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item }} style={styles.image} />
                <View style={styles.topIconsContainer}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Image
                            source={require("../icons/back.png")}
                            style={styles.iconImage}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.overlay}>
                    <View style={styles.indicatorContainer}>
                        {activityData.activityImages.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.indicator,
                                    { backgroundColor: i === activeIndex ? "white" : "lightgray" },
                                    { height: i === activeIndex ? 12 : 8 },
                                    { width: i === activeIndex ? 12 : 8 },
                                    { borderRadius: i === activeIndex ? 12 : 8 },
                                    { marginTop: i === activeIndex ? 12 : 14 },
                                ]}
                            />
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF5A5F" />
            </View>
        );
    }


    if (error || !activityData) {
        return (
            <View style={styles.container}>
                <Text style={{ color: "red", fontSize: 16, textAlign: "center" }}>
                    Unable to load activity details
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View>
                    <FlatList
                        data={activityData.activityImages}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(event) => {
                            const index = Math.round(
                                event.nativeEvent.contentOffset.x / screenWidth
                            );
                            setActiveIndex(index);
                        }}
                        renderItem={renderItem}
                        keyExtractor={(_, index) => index.toString()}
                    />
                </View>

                {/* Activity Details */}
                <View>
                    <Text numberOfLines={2} style={styles.title}>
                        {activityData.activityTitle}{", "}{activityData.activityCategory}
                    </Text>
                    <Text style={styles.subTitle}>
                        {activityData.address}{", "}{activityData.city}
                    </Text>
                    <Text style={styles.subTitle}>
                        {`${formatDate(activityData.dateRange.startDate)} - ${formatDate(activityData.dateRange.endDate)}`}
                    </Text>
                    <Text style={styles.subTitle}>
                        {`${formatTime(activityData.startTime)} - ${formatTime(activityData.endTime)}`}
                    </Text>
                    <Text style={styles.subTitle}>
                        {capitalizeFirstLetter(activityData.ageGroup)} | {activityData.maxGuestsPerDay} Guests
                    </Text>
                    {/* New Section for Price Per Guest */}
                    <Text style={styles.subTitle}>
                        Rs {activityData.pricePerGuest} per Guest
                    </Text>
                    <View style={styles.lineContainer}>
                        <View style={styles.horizontalLine} />
                    </View>
                    <View style={styles.hostingContainer}>
                        <View style={styles.titleWithIcon}>
                            <Text numberOfLines={2} style={styles.hostingTitle}>
                                Hosted By {activityData.hostName}
                            </Text>
                            <Image
                                source={{ uri: activityData.profileImage }}
                                style={[styles.iconStyle, { borderRadius: 50 }]}
                            />
                        </View>
                        <Text style={styles.hostingSubTitle}>
                            {activityData.duration} · Host in {activityData.language}
                        </Text>
                        <Text style={styles.hostingSubTitle}>
                            {activityData.companyName || "Company Not Registered on SECP"}
                        </Text>
                        <View style={styles.lineContainer}>
                            <View style={styles.horizontalLine} />
                        </View>
                    </View>
                </View>

                {/* Activity Description */}
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionHeader}>Activity Description</Text>
                    <Text style={styles.descriptionText}>
                        {isExpanded
                            ? (activityData.activityDescription || "No activity description provided")
                            : `${(activityData.activityDescription || "No activity description provided").slice(0, 100)}`}
                        {!isExpanded && activityData.activityDescription && activityData.activityDescription.length > 100 && (
                            <Text
                                style={styles.readMore}
                                onPress={() => setIsExpanded(true)}
                            >
                                {" "}Read more
                            </Text>
                        )}
                    </Text>
                </View>
                <View style={styles.lineContainer}>
                    <View style={styles.horizontalLine} />
                </View>

                {/* Location Description */}
                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionHeader}>Location Description</Text>
                    <Text style={styles.descriptionText}>
                        {isExpanded
                            ? (activityData.locationDescription || "No location description provided")
                            : `${(activityData.locationDescription || "No location description provided").slice(0, 100)}`}
                        {!isExpanded && activityData.locationDescription && activityData.locationDescription.length > 100 && (
                            <Text
                                style={styles.readMore}
                                onPress={() => setIsExpanded(true)}
                            >
                                {" "}Read more
                            </Text>
                        )}
                    </Text>
                </View>
                <View style={styles.lineContainer}>
                    <View style={styles.horizontalLine} />
                </View>

                {/* Personal Info */}
                <View>
                    <Text style={styles.PersonalInfo}>Personal Information</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.InfoSubtitle}>Phone No: {activityData.phoneNumber}</Text>
                        <TouchableOpacity
                            style={styles.infoRow}
                            onPress={() => {
                                if (activityData.certificateUri) {
                                    console.log('Navigating to CertificateViewer with URI:', activityData.certificateUri);
                                    navigation.push('CertificateViewer', {
                                        uri: activityData.certificateUri,
                                    });
                                } else {
                                    Alert.alert(
                                        "No Certificate",
                                        "No certificate has been uploaded for this activity.",
                                        [
                                            {
                                                text: "OK",
                                                style: "cancel"
                                            }
                                        ]
                                    );
                                }
                            }}
                        >
                            <Image
                                source={require('../icons/file.png')}
                                style={styles.iconStyleSmall}
                            />
                        </TouchableOpacity>


                    </View>
                    <Text style={styles.InfoSubtitle}>CNIC: {activityData.cnic}</Text>
                    <Text style={styles.InfoSubtitle}>Account Holder Name: {activityData.accountHolderName}</Text>
                    <Text style={styles.InfoSubtitle}>IBAN No: {activityData.ibanNumber}</Text>

                </View>
            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.footerButton}
                    onPress={handleRejectActivity} // Call the reject function
                >
                    <Text style={styles.footerButtonText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerButton} onPress={handleAccept}>
                    <Text style={styles.footerButtonText}>Accept</Text>
                </TouchableOpacity>

            </View>

        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingBottom:20
    },
    scrollContainer: {
        flex: 1,
    },
    imageContainer: {
        width: screenWidth,
    },
    image: {
        width: screenWidth,
        height: 300,
    },
    topIconsContainer: {
        position: "absolute",
        top: 20,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
    },
    iconButton: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 25,
        elevation: 3,
    },
    iconImage: {
        width: 20,
        height: 20,
    },
    overlay: {
        position: "absolute",
        width: "100%",
        alignItems: "center",
        bottom: 10,
    },
    indicatorContainer: {
        flexDirection: "row",
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 6,
    },
    PersonalInfo: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        paddingHorizontal: 20,
        marginBottom: 5,
    },
    title: {
        fontSize: 23,
        fontWeight: "600",
        color: "#333",
        marginTop: 20,
        marginLeft: 20,
    },
    subTitle: {
        marginLeft: 20,
        marginTop: 5,
        fontSize: 15,
    },
    lineContainer: {
        alignItems: "center",
        width: "100%",
    },
    horizontalLine: {
        height: 1,
        backgroundColor: "#ccc",
        width: "90%",
        marginTop: 15,
        marginBottom: 15
    },
    titleWithIcon: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        position: "relative",
    },
    hostingTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        width: "60%",
    },
    iconStyle: {
        width: 60,
        height: 60,
        position: "absolute",
        right: 30,
        top: "100%",
        transform: [{ translateY: -20 }],
    },
    hostingSubTitle: {
        paddingHorizontal: 20,
        marginTop: 3,
        fontSize: 15,
        color: "#555",
    },
    descriptionContainer: {
        paddingHorizontal: 20,
    },
    descriptionHeader: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    descriptionText: {
        fontSize: 15,
        marginTop: 8,
        color: "#555",
        textAlign: "justify",
    },
    readMore: {
        color: "black",
        fontWeight: "600",
    },
    InfoSubtitle: {
        paddingHorizontal: 20,
        marginTop: 3,
        fontSize: 15,
        color: "#555",
    },
    footer: {
        marginTop: 15,
        backgroundColor: "white",
        paddingHorizontal: 20,
        paddingVertical: 13,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderColor: "#ccc",
    },
    footerPrice: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    footerButton: {
        backgroundColor: "#FF5A5F",
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    footerButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "600",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 3,
    },
    iconStyleSmall: {
        width: 33,
        height: 33,
        position: "absolute",
        right: 40,
        top: "100%",
        transform: [{ translateY: -20 }],
    },
    loadingContainer: {
        flex: 1, // Takes the full height of the screen
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
        backgroundColor: 'white', // Matches your app's background
    },

});


export default AdminActivityDetails;