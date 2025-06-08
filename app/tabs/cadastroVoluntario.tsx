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

type Usuario = {
  id_usuario: number;
  nome: string;
};

type Voluntario = {
  id_voluntario: number;
  usuario: Usuario;
  disponibilidade: string;
};

export default function CadastroVoluntario() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<number | null>(null);
  const [disponibilidade, setDisponibilidade] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoadingList(true);
    try {
      const [resUsuarios, resVoluntarios] = await Promise.all([
        fetch('http://192.168.15.8:8080/users'),
        fetch('http://192.168.15.8:8080/users'),
      ]);
      if (!resUsuarios.ok || !resVoluntarios.ok) throw new Error('Falha ao carregar dados');
      const usuariosJson = await resUsuarios.json();
      const voluntariosJson = await resVoluntarios.json();
      setUsuarios(usuariosJson);
      setVoluntarios(voluntariosJson);
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoadingList(false);
    }
  };

  const handleCreate = async () => {
    if (!usuarioSelecionado || !disponibilidade.trim()) {
      Alert.alert('Erro', 'Selecione um usuário e informe disponibilidade');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://192.168.15.8:8080/voluntarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: usuarioSelecionado, disponibilidade }),
      });
      if (!res.ok) throw new Error('Falha ao criar voluntário');
      Alert.alert('Sucesso', 'Voluntário criado');
      setUsuarioSelecionado(null);
      setDisponibilidade('');
      fetchData();
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id_voluntario: number) => {
    Alert.alert('Confirmação', 'Deseja deletar este voluntário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim',
        onPress: async () => {
          try {
            const res = await fetch('http://192.168.15.8:8080/voluntarios/${id_voluntario}', {
              method: 'DELETE',
            });
            if (!res.ok) throw new Error('Falha ao deletar voluntário');
            Alert.alert('Sucesso', 'Voluntário deletado');
            fetchData();
          } catch (error) {
            Alert.alert('Erro', error instanceof Error ? error.message : 'Erro ao deletar');
          }
        },
      },
    ]);
  };

  if (loadingList) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3366FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.formContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Cadastro de Voluntário</Text>

        <Text style={styles.label}>Usuário *</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={usuarioSelecionado}
            onValueChange={(value) => setUsuarioSelecionado(value)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione um usuário" value={null} />
            {usuarios.map((u) => (
              <Picker.Item key={u.id_usuario} label={u.nome} value={u.id_usuario} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Disponibilidade *</Text>
        <TextInput
          style={styles.input}
          value={disponibilidade}
          onChangeText={setDisponibilidade}
          placeholder="Ex: Manhã, tarde, finais de semana"
          placeholderTextColor="#a0a0a0"
        />

        {loading ? (
          <ActivityIndicator size="small" color="#3366FF" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleCreate} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Criar Voluntário</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.listTitle}>Voluntários Cadastrados</Text>
      </ScrollView>

      <FlatList
        data={voluntarios}
        keyExtractor={(item) => item.id_voluntario.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.usuario.nome}</Text>
            <Text style={styles.cardText}>Disponibilidade: {item.disponibilidade}</Text>
            <TouchableOpacity
              onPress={() => handleDelete(item.id_voluntario)}
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
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bbdefb',
    overflow: 'hidden',
    shadowColor: '#5677fc',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  picker: {
    height: 56,
    paddingHorizontal: 12,
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
