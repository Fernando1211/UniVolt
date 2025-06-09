import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<NavigationProp>();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    try {
      const response = await axios.post('http://192.168.15.8:8080/login', {
        email,
        password,
      });

      const { token } = response.data;
      await AsyncStorage.setItem('token', token);
      router.push('/tabs/cadastroUsuario');
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 401 || status === 404) {
        Alert.alert('Cadastro necessário', 'Usuário não encontrado. Redirecionando para o cadastro...');
        navigation.navigate('cadastroUsuario');
      } else {
        console.error('Erro no login:', error);
        Alert.alert('Erro', 'Erro inesperado ao fazer login');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Senha"
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Entrar" onPress={handleLogin} />

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('cadastroUsuario')}
      >
        <Text style={styles.registerButtonText}>Ainda não tem cadastro? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#357ABD',
    fontSize: 14,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
