import React, { useEffect, useRef } from 'react';
import { View, Image, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  // Create animated values for logo and text
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Faster and more responsive animation
    const animationDuration = 800; // Reduced animation duration
    const totalAnimationTime = 5000; // Total time before navigation

    // Animate logo and text with reduced duration
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: animationDuration,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: animationDuration,
        delay: 300, // Slight delay for text appearance
        easing: Easing.ease,
        useNativeDriver: true
      })
    ]).start();


    // Automatically navigate to the main app after a shorter delay
    const timer = setTimeout(() => {
        navigation.navigate("AdminLogin");
    }, totalAnimationTime);


    // Clean up the timer
    return () => clearTimeout(timer);
  }, [navigation, logoScale, logoOpacity, textOpacity]);


  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../images/logo.png')}
        style={[
          styles.logo,
          {
            transform: [{ scale: logoScale }],
            opacity: logoOpacity
          }
        ]}
        resizeMode="contain"
      />
      <Animated.Text
        style={[
          styles.appName,
          {
            opacity: textOpacity
          }
        ]}
      >
        TouristGuide
      </Animated.Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Pure white background
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 180, // Slightly larger logo
    height: 180,
  },
  appName: {
    marginTop: 20,
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FF5A5F',
    letterSpacing: 0.7,
  },
});


export default SplashScreen;
