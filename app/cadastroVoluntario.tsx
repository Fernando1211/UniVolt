import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator, Alert, FlatList, TouchableOpacity } from 'react-native';
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
        fetch('https://suaapi.com/usuarios'),
        fetch('https://suaapi.com/voluntarios'),
      ]);
      if (!resUsuarios.ok || !resVoluntarios.ok) throw new Error('Falha ao carregar dados');

      const usuariosJson = await resUsuarios.json();
      const voluntariosJson = await resVoluntarios.json();

      setUsuarios(usuariosJson);
      setVoluntarios(voluntariosJson);
    } catch (error) {
  if (error instanceof Error) {
    Alert.alert('Erro', error.message || 'Erro ao carregar dados');
  } else {
    Alert.alert('Erro', 'Erro desconhecido ao carregar dados');
  }
}
  };

  const handleCreate = async () => {
    if (!usuarioSelecionado || !disponibilidade.trim()) {
      Alert.alert('Erro', 'Selecione um usuário e informe disponibilidade');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://suaapi.com/voluntarios', {
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
      if (error instanceof Error) {
        Alert.alert('Erro', error.message || 'Erro ao criar voluntário');
    } else {
      Alert.alert('Erro', 'Erro desconhecido ao criar voluntário');
    }
    }
  };

  const handleDelete = async (id_voluntario: number) => {
    Alert.alert('Confirmação', 'Deseja deletar este voluntário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim',
        onPress: async () => {
          try {
            const res = await fetch(`https://suaapi.com/voluntarios/${id_voluntario}`, {
              method: 'DELETE',
            });
            if (!res.ok) throw new Error('Falha ao deletar voluntário');
            Alert.alert('Sucesso', 'Voluntário deletado');
            fetchData();
          } catch (error) {
  if (error instanceof Error) {
    Alert.alert('Erro', error.message || 'Erro ao deletar voluntário');
  } else {
    Alert.alert('Erro', 'Erro desconhecido ao deletar voluntario');
  }
}

        },
      },
    ]);
  };

  if (loadingList) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastro de Voluntário</Text>

      <Text>Usuário</Text>
      <Picker selectedValue={usuarioSelecionado} onValueChange={(v) => setUsuarioSelecionado(v)}>
        <Picker.Item label="Selecione um usuário" value={null} />
        {usuarios.map((u) => (
          <Picker.Item key={u.id_usuario} label={u.nome} value={u.id_usuario} />
        ))}
      </Picker>

      <Text>Disponibilidade</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Seg, Qua, Sex - Manhã"
        value={disponibilidade}
        onChangeText={setDisponibilidade}
      />

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Criar Voluntário" onPress={handleCreate} />
      )}

      <Text style={styles.listTitle}>Voluntários Cadastrados</Text>
      <FlatList
        data={voluntarios}
        keyExtractor={(item) => item.id_voluntario.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={{ fontWeight: 'bold' }}>{item.usuario.nome}</Text>
            <Text>Disponibilidade: {item.disponibilidade}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id_voluntario)} style={styles.deleteBtn}>
              <Text style={{ color: 'white' }}>Deletar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  listTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 24, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#aaa', padding: 8, marginBottom: 12, borderRadius: 4 },
  card: {
    backgroundColor: '#eee',
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
  },
  deleteBtn: {
    marginTop: 8,
    backgroundColor: 'red',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
});
