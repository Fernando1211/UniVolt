import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const API_URL = 'http://192.168.15.8:8080';

export default function Login() {
  const [isCadastro, setIsCadastro] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [role, setRole] = useState('USER');
  const router = useRouter();

  const limpar = () => {
    setEmail('');
    setSenha('');
    setNome('');
    setRole('USER');
  };

  const handleLogin = async () => {
  try {
    await AsyncStorage.removeItem('token'); // 🔄 Evita token falso

    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: senha }),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || 'Email ou senha inválidos');
    }

    const data = await res.json();
    if (!data.token) throw new Error('Token não recebido');

    await AsyncStorage.setItem('token', data.token);
    router.replace('/tabs');
  } catch (error) {
    Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao logar');
  }
};


  const handleCadastro = async () => {
    if (!email || !senha || !nome) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, role }),
      });

      if (!res.ok) throw new Error('Erro ao criar conta');
      Alert.alert('Conta criada com sucesso!');
      setIsCadastro(false);
      limpar();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro desconhecido');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isCadastro ? 'Criar Conta' : 'Login'}</Text>

      {isCadastro && (
        <>
          <TextInput placeholder="Nome" style={styles.input} value={nome} onChangeText={setNome} />
          <TextInput placeholder="Perfil (ADMIN ou USER)" style={styles.input} value={role} onChangeText={setRole} />
        </>
      )}

      <TextInput placeholder="E-mail" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Senha" secureTextEntry style={styles.input} value={senha} onChangeText={setSenha} />

      <TouchableOpacity style={styles.button} onPress={isCadastro ? handleCadastro : handleLogin}>
        <Text style={styles.buttonText}>{isCadastro ? 'Criar Conta' : 'Entrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsCadastro(!isCadastro)}>
        <Text style={styles.toggleText}>
          {isCadastro ? 'Já tem conta? Entrar' : 'Não tem conta? Cadastre-se'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#e9f0ff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, alignSelf: 'center' },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#1a237e',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  toggleText: { color: '#1a237e', textAlign: 'center', marginTop: 12, fontSize: 15 },
});
