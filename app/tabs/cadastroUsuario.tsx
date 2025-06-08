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
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.15.8:8080';

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

<<<<<<< HEAD
const API_URL = 'http://192.168.15.8:8080';

=======
>>>>>>> 5094279dbf22a1f6340fc6227c1dba18ec3be309
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
<<<<<<< HEAD
=======
  const [loadingList, setLoadingList] = useState(true);

  const fetchUsuarios = useCallback(async () => {
    setLoadingList(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const json = await res.json();
      setUsuarios(json.content || json || []);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao buscar usuários');
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);
>>>>>>> 5094279dbf22a1f6340fc6227c1dba18ec3be309

  const clearForm = () => setForm({ id_usuario: 0, nome: '', email: '', telefone: '', localizacao: '', habilidades: '', senha: '', role: 'USER' });

<<<<<<< HEAD
  const handleCreate = async () => {
    const { nome, email, senha } = form;

    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Nome, email e senha são obrigatórios');
      return;
    }
=======
  const handleSave = async () => {
    const { id_usuario, nome, email, senha } = form;
    if (!nome || !email || !senha) return Alert.alert('Erro', 'Nome, email e senha são obrigatórios');
>>>>>>> 5094279dbf22a1f6340fc6227c1dba18ec3be309

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const payload = {
        ...form,
        role: form.role?.toUpperCase(),
        habilidades: form.habilidades ? form.habilidades.split(',').map(h => h.trim()) : [],
      };

      const res = await fetch(`${API_URL}/users${id_usuario ? `/${id_usuario}` : ''}`, {
        method: id_usuario ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(id_usuario ? 'Erro ao atualizar' : 'Erro ao criar');
      Alert.alert('Sucesso', id_usuario ? 'Usuário atualizado' : 'Usuário cadastrado');
      clearForm();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
=======
  const handleDelete = (id_usuario: number) => {
    Alert.alert('Confirmação', 'Deseja deletar este usuário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            const res = await fetch(`${API_URL}/users/${id_usuario}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
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

>>>>>>> 5094279dbf22a1f6340fc6227c1dba18ec3be309
  const renderInput = (label: string, key: keyof Usuario, placeholder: string, props = {}) => (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
<<<<<<< HEAD
=======
        value={form[key]?.toString() || ''}
>>>>>>> 5094279dbf22a1f6340fc6227c1dba18ec3be309
        onChangeText={(text) => setForm({ ...form, [key]: text })}
        placeholder={placeholder}
        {...props}
      />
    </>
  );

<<<<<<< HEAD
=======
  if (loadingList) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#3366FF" /></View>;
  }

>>>>>>> 5094279dbf22a1f6340fc6227c1dba18ec3be309
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>{form.id_usuario ? 'Editar Usuário' : 'Cadastro de Usuário'}</Text>

        {renderInput('Nome *', 'nome', 'Digite o nome')}
        {renderInput('Email *', 'email', 'Digite o e-mail', { keyboardType: 'email-address' })}
        {renderInput('Senha *', 'senha', 'Digite a senha', { secureTextEntry: true })}
        {renderInput('Perfil (ADMIN ou USER)', 'role', 'ADMIN ou USER')}
        {renderInput('Telefone', 'telefone', '(00) 00000-0000', { keyboardType: 'phone-pad' })}
        {renderInput('Localização', 'localizacao', 'Cidade ou estado')}
        {renderInput('Habilidades', 'habilidades', 'Digite suas habilidades')}

        {loading ? (
          <ActivityIndicator size="small" color="#3366FF" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>{form.id_usuario ? 'Salvar Alterações' : 'Criar Usuário'}</Text>
          </TouchableOpacity>
        )}
<<<<<<< HEAD
      </ScrollView>
=======

        
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
            <TouchableOpacity style={[styles.deleteBtn, { backgroundColor: '#1a237e', marginTop: 8 }]} onPress={() => setForm(item)}>
              <Text style={styles.deleteBtnText}>Editar</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
      />
>>>>>>> 5094279dbf22a1f6340fc6227c1dba18ec3be309
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e9f0ff', paddingTop: Platform.OS === 'android' ? 25 : 45 },
  formContainer: { paddingHorizontal: 24, paddingBottom: 20 },
  title: { fontSize: 30, fontWeight: '800', color: '#1a237e', marginBottom: 28, alignSelf: 'center' },
  label: { fontSize: 17, fontWeight: '600', color: '#303f9f', marginBottom: 8 },
  input: {
    backgroundColor: '#fff', paddingVertical: 14, paddingHorizontal: 18, fontSize: 17,
    borderRadius: 14, marginBottom: 20, borderWidth: 1, borderColor: '#bbdefb',
    shadowColor: '#5677fc', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
  },
  button: {
    backgroundColor: '#1a237e', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 16, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.3,
    shadowRadius: 12, elevation: 8, marginBottom: 16,
  },
<<<<<<< HEAD
  buttonText: { color: '#fff', fontWeight: '800', fontSize: 18 },
});
=======
  buttonText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  listTitle: { fontSize: 24, fontWeight: '700', marginBottom: 16, color: '#1a237e', paddingLeft: 24 },
  card: {
    backgroundColor: '#fff', padding: 20, marginHorizontal: 24, marginBottom: 18, borderRadius: 20,
    shadowColor: '#223366', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 6,
  },
  cardTitle: { fontWeight: '800', fontSize: 20, color: '#1a237e', marginBottom: 8 },
  cardText: { fontSize: 16, color: '#4250a1', marginBottom: 6 },
  deleteBtn: {
    marginTop: 12, backgroundColor: '#d32f2f', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 14,
    alignSelf: 'flex-start', shadowColor: '#8b0000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.6,
    shadowRadius: 7, elevation: 5,
  },
  deleteBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
});
>>>>>>> 5094279dbf22a1f6340fc6227c1dba18ec3be309
