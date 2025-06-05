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

type Organizacao = {
  id_organizacao: number;
  nome: string;
  tipo: string;
  contato: string;
};

const tipos = ['ONG', 'Prefeitura', 'Empresa', 'Outros'];

export default function CadastroOrg() {
  const [organizacoes, setOrganizacoes] = useState<Organizacao[]>([]);
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<string | null>(null);
  const [contato, setContato] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    fetchOrganizacoes();
  }, []);

  const fetchOrganizacoes = async () => {
    setLoadingList(true);
    try {
      const res = await fetch('https://suaapi.com/organizacoes');
      if (!res.ok) throw new Error('Erro ao carregar organizações');
      const data = await res.json();
      setOrganizacoes(data);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoadingList(false);
    }
  };

  const handleCreate = async () => {
    if (!nome || !tipo || !contato) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://suaapi.com/organizacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const handleDelete = (id_organizacao: number) => {
    Alert.alert('Confirmação', 'Deseja deletar esta organização?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim',
        onPress: async () => {
          try {
            const res = await fetch(`https://suaapi.com/organizacoes/${id_organizacao}`, {
              method: 'DELETE',
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
        <Text style={styles.title}>Cadastro de Organização</Text>

        <Text style={styles.label}>Nome *</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Nome da organização"
          placeholderTextColor="#a0a0a0"
        />

        <Text style={styles.label}>Tipo *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={tipo}
            onValueChange={(itemValue) => setTipo(itemValue)}
            style={styles.picker}
            dropdownIconColor="#1a237e"
          >
            <Picker.Item label="Selecione o tipo" value={null} />
            {tipos.map((t, idx) => (
              <Picker.Item key={idx} label={t} value={t} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Contato *</Text>
        <TextInput
          style={styles.input}
          value={contato}
          onChangeText={setContato}
          placeholder="Email ou telefone"
          placeholderTextColor="#a0a0a0"
        />

        {loading ? (
          <ActivityIndicator size="small" color="#3366FF" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={handleCreate}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Cadastrar Organização</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.listTitle}>Organizações Cadastradas</Text>
      </ScrollView>

      <FlatList
        data={organizacoes}
        keyExtractor={(item) => item.id_organizacao.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nome}</Text>
            <Text style={styles.cardText}>Tipo: {item.tipo}</Text>
            <Text style={styles.cardText}>Contato: {item.contato}</Text>
            <TouchableOpacity
              onPress={() => handleDelete(item.id_organizacao)}
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
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#bbdefb',
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    fontSize: 17,
    color: '#000',
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
