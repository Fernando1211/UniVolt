import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.15.8:8080';
const tipos = ['ONG', 'Prefeitura', 'Empresa', 'Outros'];

export default function CadastroOrganizacao() {
  const [organizacoes, setOrganizacoes] = useState([]);
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState(null);
  const [contato, setContato] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  const fetchOrganizacoes = async () => {
    setLoadingList(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const query = `?nome=${nome}&tipo=${tipo ?? ''}&contato=${contato}`;

      const res = await fetch(`${API_URL}/organizacoes${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Erro ao carregar organizações');
      const data = await res.json();
      setOrganizacoes(data.content ?? []);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchOrganizacoes();
  }, []);

  const handleCreate = async () => {
    if (!nome || !tipo || !contato) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/organizacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, tipo, contato }),
      });
      if (!res.ok) throw new Error('Erro ao cadastrar organização');
      Alert.alert('Sucesso', 'Organização cadastrada');
      setNome('');
      setTipo(null);
      setContato('');
      fetchOrganizacoes();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Confirmação', 'Deseja deletar esta organização?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            const res = await fetch(`${API_URL}/organizacoes/${id}`, {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (!res.ok) throw new Error('Erro ao deletar organização');
            Alert.alert('Sucesso', 'Organização removida');
            fetchOrganizacoes();
          } catch (error) {
            Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao deletar');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.formContainer}>
        <Text style={styles.title}>Cadastro de Organização</Text>

        <Text style={styles.label}>Nome *</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome da organização" />

        <Text style={styles.label}>Tipo *</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={tipo} onValueChange={setTipo} style={styles.picker}>
            <Picker.Item label="Selecione o tipo" value={null} />
            {tipos.map((t) => (
              <Picker.Item key={t} label={t} value={t} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Contato *</Text>
        <TextInput style={styles.input} value={contato} onChangeText={setContato} placeholder="Email ou telefone" />

        {loading ? (
          <ActivityIndicator size="small" color="#3366FF" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleCreate}>
            <Text style={styles.buttonText}>Cadastrar Organização</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={[styles.button, { backgroundColor: '#888' }]} onPress={fetchOrganizacoes}>
          <Text style={styles.buttonText}>Buscar com Filtros</Text>
        </TouchableOpacity>

        <Text style={styles.listTitle}>Organizações Cadastradas</Text>
      </ScrollView>

      <FlatList
        data={organizacoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nome}</Text>
            <Text style={styles.cardText}>Tipo: {item.tipo}</Text>
            <Text style={styles.cardText}>Contato: {item.contato}</Text>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
              <Text style={styles.deleteBtnText}>Deletar</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e9f0ff', paddingTop: Platform.OS === 'android' ? 25 : 45 },
  loadingContainer: { flex: 1, justifyContent: 'center', backgroundColor: '#e9f0ff' },
  formContainer: { paddingHorizontal: 24, paddingBottom: 20 },
  title: { fontSize: 30, fontWeight: '800', color: '#1a237e', marginBottom: 28, alignSelf: 'center' },
  label: { fontSize: 17, fontWeight: '600', color: '#303f9f', marginBottom: 8 },
  input: {
    backgroundColor: '#fff', paddingVertical: 14, paddingHorizontal: 18, fontSize: 17,
    borderRadius: 14, marginBottom: 20, borderWidth: 1, borderColor: '#bbdefb',
  },
  pickerContainer: {
    backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#bbdefb', marginBottom: 20,
    overflow: 'hidden',
  },
  picker: { height: 50 },
  button: {
    backgroundColor: '#1a237e', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginBottom: 20,
  },
  buttonText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  listTitle: { fontSize: 24, fontWeight: '700', marginBottom: 16, color: '#1a237e', paddingLeft: 24 },
  card: {
    backgroundColor: '#fff', padding: 20, marginHorizontal: 24, marginBottom: 18, borderRadius: 20,
  },
  cardTitle: { fontWeight: '800', fontSize: 20, color: '#1a237e', marginBottom: 8 },
  cardText: { fontSize: 16, color: '#4250a1', marginBottom: 6 },
  deleteBtn: {
    marginTop: 12, backgroundColor: '#d32f2f', paddingVertical: 12, paddingHorizontal: 28, borderRadius: 14,
    alignSelf: 'flex-start',
  },
  deleteBtnText: { color: 'white', fontWeight: '700', fontSize: 15 },
});
