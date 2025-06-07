import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
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

const API_URL = 'http://10.3.46.35:8080';

export default function CadastroUsuario() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
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
  const [loadingList, setLoadingList] = useState(true);

  const fetchUsuarios = useCallback(async () => {
    setLoadingList(true);
    try {
      const res = await fetch(`${API_URL}/users`);
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erro ${res.status}: ${errorText || res.statusText}`);
      }
  
      const text = await res.text();
  
      if (!text) {
        setUsuarios([]); // Nenhum usuário retornado
        return;
      }
  
      const data = JSON.parse(text);
      setUsuarios(data);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao buscar usuários');
    } finally {
      setLoadingList(false);
    }
  }, []);
  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

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
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Erro ao criar usuário');
      Alert.alert('Sucesso', 'Usuário cadastrado');
      clearForm();
      fetchUsuarios();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id_usuario: number) => {
    Alert.alert('Confirmação', 'Deseja deletar este usuário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim',
        onPress: async () => {
          try {
            const res = await fetch(`${API_URL}/users/${id_usuario}`, {
              method: 'DELETE',
            });
            if (!res.ok) throw new Error('Erro ao deletar');
            Alert.alert('Sucesso', 'Usuário deletado');
            fetchUsuarios();
          } catch (error) {
            Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao deletar');
          }
        },
      },
    ]);
  };

  const renderInput = (label: string, key: keyof Usuario, placeholder: string, props = {}) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        //value={form[key] || ''}
        onChangeText={(text) => setForm({ ...form, [key]: text })}
        placeholder={placeholder}
        {...props}
      />
    </>
  );

  if (loadingList) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3366FF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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

        <Text style={styles.listTitle}>Usuários Cadastrados</Text>
      </ScrollView>

      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id_usuario.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nome}</Text>
            <Text style={styles.cardText}>Email: {item.email}</Text>
            <Text style={styles.cardText}>Telefone: {item.telefone || '—'}</Text>
            <Text style={styles.cardText}>Localização: {item.localizacao || '—'}</Text>
            <Text style={styles.cardText}>Habilidades: {item.habilidades || '—'}</Text>
            <Text style={styles.cardText}>Perfil: {item.role || 'USER'}</Text>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id_usuario)}>
              <Text style={styles.deleteBtnText}>Deletar</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e9f0ff', paddingTop: Platform.OS === 'android' ? 25 : 45 },
  loadingContainer: { flex: 1, justifyContent: 'center', backgroundColor: '#e9f0ff' },
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
  listTitle: { fontSize: 24, fontWeight: '700', marginBottom: 16, color: '#1a237e', paddingLeft: 24 },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 18,
    borderRadius: 20,
    shadowColor: '#223366',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: { fontWeight: '800', fontSize: 20, color: '#1a237e', marginBottom: 8 },
  cardText: { fontSize: 16, color: '#4250a1', marginBottom: 6 },
  deleteBtn: {
    marginTop: 12,
    backgroundColor: '#d32f2f',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 14,
    alignSelf: 'flex-start',
    shadowColor: '#8b0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 7,
    elevation: 5,
  },
  deleteBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
});
