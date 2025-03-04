import React, { useState, useEffect } from "react";
import {
    View,
    FlatList,
    Image,
    Text,
    ScrollView,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    Alert
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import apiInstance from "../config/apiConfig";

const screenWidth = Dimensions.get("window").width;

const AcceptedActivityDetails = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const { activityId } = route.params;

    const [activityData, setActivityData] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchActivityDetails = async () => {
            try {
                setLoading(true);
                const response = await apiInstance.get(`/activityDetails/${activityId}?includeVerificationDetails=true`);
                if (response.data.success) {
                    setActivityData(response.data.data);
                } else {
                    throw new Error("Failed to fetch activity details");
                }
            } catch (error) {
                if (!error.response) {
                  Alert.alert('Network Error', 'Check internet connection');
                } else {
                  Alert.alert('Error', 'Failed to load Accepted Activity Details!');
                }
                setActivities([]);
              } finally {
                setLoading(false);
            }
        };

        fetchActivityDetails();
    }, [activityId]);

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
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF5A5F" />
                <Text style={styles.loadingText}>Loading Accepted Activity...</Text>
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
                    <Text style={styles.subTitle}>
                        Rs {activityData.pricePerGuest} per Guest
                    </Text>
                    <View style={styles.lineContainer}>
                        <View style={styles.horizontalLine} />
                    </View>
                    <View style={styles.hostingContainer}>
                        <View style={styles.titleWithIcon}>
                            <Text numberOfLines={2} style={styles.hostingTitle}>
                                Hosted By {activityData.hostName || "Unknown Host"}
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
                    <Text style={styles.InfoSubtitle}>Credit Card No: {activityData.creditCardNumber}</Text>
                </View>
            </ScrollView>

            {/* Modal for verification details */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Image
                                source={require("../icons/cross.png")}
                                style={styles.modalCloseButton}
                            />
                        </TouchableOpacity>
                        <Text style={styles.modalHeader}>Accepted</Text>
                        <Text style={styles.modalContent}>
                            Verification Date: {formatDate(activityData.acceptedAt)}
                        </Text>
                        <Text style={styles.modalContent}>
                            Verification Time: {formatTime(activityData.acceptedAt)}
                        </Text>
                    </View>
                </View>
            </Modal>

            {/* Top icons */}
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
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Image
                        source={require("../icons/check.png")}
                        style={styles.iconImage}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
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
        borderRadius: 6,
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
    InfoSubtitle1: {
        paddingHorizontal: 20,
        marginTop: 3,
        fontSize: 15,
        color: "#555",
        marginVertical: 20,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
        justifyContent: "center", // Center the modal vertically
        alignItems: "center", // Center the modal horizontally
    },
    modalContainer: {
        width: "70%", // Adjust width for responsiveness
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
        paddingBottom: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        fontSize: 20,
        fontWeight: "800",
        color: "#333",
        marginBottom: 10,
        textAlign: "center",
    },
    modalContent: {
        fontSize: 16,
        color: "#555",
        textAlign: "left",
        marginBottom: 2,
    },
    modalCloseButton: {
        height: 25,
        width: 25,
        marginLeft: 220
    },
    loadingContainer: {
        flex: 1, // Takes the full height of the screen
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
        backgroundColor: 'white', // Matches your app's background
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#FF5A5F',
    },
});


export default AcceptedActivityDetails;
