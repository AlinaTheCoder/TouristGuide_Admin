import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Alert,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import apiInstance from '../config/apiConfig';
const AdminLogin = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});


  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateFields = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!validateEmail(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailLogin = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const response = await apiInstance.post('/adminLogin', { email: email.trim(), password: password.trim() });
      if (response.data?.uid) {
        await AsyncStorage.setItem('uid', response.data.uid);
        Alert.alert('Success', 'Welcom Admin!');
        setEmail('');
        setPassword('');
        setErrors({});
        navigation.navigate('AdminTabs', {
          screen: 'PendingActivities', // Specify the screen in the stack
        });
      } else {
        throw new Error('Invalid response from server.');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || error.message || 'Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>ADMIN LOGIN</Text>

        <InputField
          placeholder="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text.toLowerCase());
            if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
          }}
          keyboardType="email-address"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <InputField
          placeholder="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
          }}
          secureTextEntry
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#FF5A5F" />
          </View>
        ) : (
          <CustomButton title="Login" onPress={handleEmailLogin} disabled={loading} />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF5A5F',
    marginBottom: 30,
  },
  orText: {
    marginVertical: 15,
    fontSize: 16,
    color: '#666',
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
    justifyContent: 'center',
  },
  line: {
    width: '8%',
    height: 1.5,
    backgroundColor: '#ccc',
  },
  noAccountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  noAccountText: {
    fontSize: 16,
    color: '#666',
  },
  signupLink: {
    fontSize: 16, // Ensure the font size matches
    color: '#FF5A5F',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginLeft: '9%',
  },
  loaderContainer: {
    marginTop: 20,
  },
});

export default AdminLogin;
