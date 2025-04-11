import { StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminTabs from './src/navigations/AdminTabs';
import AdminLogin from './src/screens/AdminLogin';
import AdminActivityDetails from './src/screens/AdminActivityDetails';
import AcceptedActivityDetails from './src/screens/AcceptedActivityDetails';
import RejectedActivityDetails from './src/screens/RejectedActivityDetails';
import CertificateViewer from './src/screens/CertificateViewer';
import NetInfo from '@react-native-community/netinfo';
import ErrorBoundary from './src/components/ErrorBoundry';
import OfflineFallback from './src/components/OfflineFallback';
import SplashScreen from './src/screens/SplashScreen';
const Stack = createNativeStackNavigator();
import apiInstance from './src/config/apiConfig';

export default function App() {
  const [isOffline, setIsOffline] = useState(false);

  
// this useEffect is for testing the backend connection
  // This effect will run once when the component mounts
  // and will check the backend connection
 // In your admin App.jsx, modify your backend connection test like this:

useEffect(() => {
  // Reference to keep track if the component is mounted
  let isMounted = true;
  let connectionCheckInterval = null;

  // Function to test backend connection
  const testBackendConnection = async () => {
    try {
      const response = await apiInstance.get('/health');
      
      if (isMounted) {
        console.log('Backend connection successful:', response.data);
        
        // Show success message on first successful connection
        if (!global.backendConnected) {
          global.backendConnected = true;
          console.log('Connected to server successfully');
        }
      }
    } catch (error) {
      if (isMounted) {
        console.error('Backend connection failed:', error);
        global.backendConnected = false;
        
        // Detailed error logging
        if (error.response) {
          // Server responded with error status code
          console.error('Server error:', error.response.status, error.response.data);
        } else if (error.request) {
          // No response received
          console.error('Network error - no response received');
        } else {
          // Error setting up request
          console.error('Request setup error:', error.message);
        }
      }
    }
  };

  // Run test immediately on component mount
  testBackendConnection();

  // Cleanup function for when component unmounts
  return () => {
    isMounted = false;
    if (connectionCheckInterval) {
      clearInterval(connectionCheckInterval);
    }
  };
}, []); // Empty dependency array means this runs once on mount

    // Network monitoring
    useEffect(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        setIsOffline(!state.isConnected);
      });
      return () => unsubscribe();
    }, []);
  
    const handleRetry = () => {
      NetInfo.fetch().then(state => {
        setIsOffline(!state.isConnected);
      });
    };
  return (
    <ErrorBoundary>
    {isOffline ? (
      <OfflineFallback onRetry={handleRetry} />
    ) : (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
          name="AdminTabs"
          component={AdminTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AcceptedActivityDetails"
          component={AcceptedActivityDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RejectedActivityDetails"
          component={RejectedActivityDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminLogin"
          component={AdminLogin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AdminActivityDetails"
          component={AdminActivityDetails}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CertificateViewer"
          component={CertificateViewer}
          options={{ headerShown: true, title: 'Certificate' }}
        />
        <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{ headerShown: false}}
        />

      </Stack.Navigator>
    </NavigationContainer>
     )}
    </ErrorBoundary>
  );
}


const styles = StyleSheet.create({});



