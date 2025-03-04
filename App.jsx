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
const Stack = createNativeStackNavigator();

export default function App() {
  const [isOffline, setIsOffline] = useState(false);

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
      <Stack.Navigator initialRouteName="AdminTabs">
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

      </Stack.Navigator>
    </NavigationContainer>
     )}
    </ErrorBoundary>
  );
}


const styles = StyleSheet.create({});



