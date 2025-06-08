import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';

type Usuario = {
  id_usuario: number;
  nome: string;
  email: string;
  telefone?: string;
  localizacao?: string;
  habilidades?: string;
  senha?: string;
  role?: 'ADMIN' | 'USER';
};

const API_URL = 'http://192.168.15.8:8080';

export default function CadastroUsuario() {
  const [form, setForm] = useState<Usuario>({
    id_usuario: 0,
    nome: '',
    email: '',
    telefone: '',
    localizacao: '',
    habilidades: '',
    senha: '',
    role: 'USER',
  });

  const [loading, setLoading] = useState(false);

  const clearForm = () => {
    setForm({
      id_usuario: 0,
      nome: '',
      email: '',
      telefone: '',
      localizacao: '',
      habilidades: '',
      senha: '',
      role: 'USER',
    });
  };

  const handleCreate = async () => {
    const { nome, email, senha } = form;

    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Nome, email e senha são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        habilidades: form.habilidades
          ? form.habilidades.split(',').map((h) => h.trim())
          : [],
      };

      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Erro ao criar usuário');
      Alert.alert('Sucesso', 'Usuário cadastrado');
      clearForm();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label: string, key: keyof Usuario, placeholder: string, props = {}) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => setForm({ ...form, [key]: text })}
        placeholder={placeholder}
        {...props}
      />
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Cadastro de Usuário</Text>

        {renderInput('Nome *', 'nome', 'Digite o nome')}
        {renderInput('Email *', 'email', 'Digite o e-mail', { keyboardType: 'email-address' })}
        {renderInput('Senha *', 'senha', 'Digite a senha', { secureTextEntry: true })}
        {renderInput('Perfil (ADMIN ou USER) *', 'role', 'ADMIN ou USER')}
        {renderInput('Telefone', 'telefone', '(00) 00000-0000', { keyboardType: 'phone-pad' })}
        {renderInput('Localização', 'localizacao', 'Cidade ou estado')}
        {renderInput('Habilidades', 'habilidades', 'Digite suas habilidades')}

        {loading ? (
          <ActivityIndicator size="small" color="#3366FF" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleCreate}>
            <Text style={styles.buttonText}>Criar Usuário</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e9f0ff', paddingTop: Platform.OS === 'android' ? 25 : 45 },
  formContainer: { paddingHorizontal: 24, paddingBottom: 20 },
  title: { fontSize: 30, fontWeight: '800', color: '#1a237e', marginBottom: 28, alignSelf: 'center' },
  label: { fontSize: 17, fontWeight: '600', color: '#303f9f', marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 17,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bbdefb',
    shadowColor: '#5677fc',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    backgroundColor: '#1a237e',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 36,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: { color: '#fff', fontWeight: '800', fontSize: 18 },
});
