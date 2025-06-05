import React, { useEffect, useState } from 'react';
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
} from 'react-native';
 
type Usuario = {
  id_usuario: number;
  nome: string;
  email: string;
  telefone?: string;
  localizacao?: string;
  habilidades?: string;
};
 
export default function CadastroUsuario() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [habilidades, setHabilidades] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
 
  useEffect(() => {
    fetchUsuarios();
  }, []);
 
  const fetchUsuarios = async () => {
    setLoadingList(true);
    try {
      const res = await fetch('https://localhost:8080/usuarios');
      if (!res.ok) throw new Error('Falha ao carregar usuários');
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoadingList(false);
    }
  };
 
  const handleCreate = async () => {
    if (!nome || !email) {
      Alert.alert('Erro', 'Nome e email são obrigatórios');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://localhost:8080/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, telefone, localizacao, habilidades }),
      });
      if (!res.ok) throw new Error('Falha ao criar usuário');
      Alert.alert('Sucesso', 'Usuário criado');
      setNome('');
      setEmail('');
      setTelefone('');
      setLocalizacao('');
      setHabilidades('');
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
            const res = await fetch(`https://localhost:8080/usuarios/${id_usuario}`, {
              method: 'DELETE',
            });
            if (!res.ok) throw new Error('Falha ao deletar usuário');
            Alert.alert('Sucesso', 'Usuário deletado');
            fetchUsuarios();
          } catch (error) {
            Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao deletar');
          }
        },
      },
    ]);
  };
 
  if (loadingList)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3366FF" />
      </View>
    );
 
  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Cadastro de Usuário</Text>
 
        <Text style={styles.label}>Nome *</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Digite o nome"
          placeholderTextColor="#a0a0a0"
        />
 
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Digite o e-mail"
          placeholderTextColor="#a0a0a0"
          keyboardType="email-address"
        />
 
        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
          placeholder="(00) 00000-0000"
          placeholderTextColor="#a0a0a0"
          keyboardType="phone-pad"
        />
 
        <Text style={styles.label}>Localização</Text>
        <TextInput
          style={styles.input}
          value={localizacao}
          onChangeText={setLocalizacao}
          placeholder="Cidade ou estado"
          placeholderTextColor="#a0a0a0"
        />
 
        <Text style={styles.label}>Habilidades</Text>
        <TextInput
          style={styles.input}
          value={habilidades}
          onChangeText={setHabilidades}
          placeholder="Digite suas habilidades"
          placeholderTextColor="#a0a0a0"
        />
 
        {loading ? (
          <ActivityIndicator
            size="small"
            color="#3366FF"
            style={{ marginTop: 20 }}
          />
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={handleCreate}
            activeOpacity={0.85}
          >
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
            <TouchableOpacity
              onPress={() => handleDelete(item.id_usuario)}
              style={styles.deleteBtn}
              activeOpacity={0.75}
            >
              <Text style={styles.deleteBtnText}>Deletar</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9f0ff',
    paddingTop: Platform.OS === 'android' ? 25 : 45,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#e9f0ff',
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1a237e',
    marginBottom: 28,
    alignSelf: 'center',
    letterSpacing: 0.8,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: '#303f9f',
    marginBottom: 8,
  },
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
  buttonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: 1,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#1a237e',
    paddingLeft: 24,
  },
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
  cardTitle: {
    fontWeight: '800',
    fontSize: 20,
    color: '#1a237e',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: '#4250a1',
    marginBottom: 6,
  },
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
  deleteBtnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
});