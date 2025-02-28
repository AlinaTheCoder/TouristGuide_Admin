import React from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';


export default function NoRejectedActivity() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Rejected</Text>
      <View style={styles.content}>
        <Image
          source={require("../images/rejected.jpg")} // Ensure the image exists in assets folder
          style={styles.image}
        />
        <Text style={styles.title}>No Activities Rejected Yet!</Text>
        <Text style={styles.subtitle}>You have not rejected any activities yet. Keep up the great work and you will find best ones.</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 38, // Increased font size
    fontWeight: '600', // Increased font weight
    color: 'black',
    letterSpacing: 0.6,
    marginLeft: 31,
    marginTop: 67,
    marginBottom: 0
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 60,
    marginTop: -75,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 21,
    fontWeight: '500', // Made bold
    marginBottom: 15,
    color: 'black'
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: 'center', // Align text centered and justify
    width: 340
  },
});







