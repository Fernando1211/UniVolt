import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator, Alert, FlatList, TouchableOpacity } from 'react-native';

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

  // Pega a lista de usuários
  const fetchUsuarios = async () => {
    setLoadingList(true);
    try {
      const res = await fetch('https://suaapi.com/usuarios');
      if (!res.ok) throw new Error('Falha ao carregar usuários');
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
    if (error instanceof Error) {
      Alert.alert('Erro', error.message || 'Erro ao carregar usuários');
    } else {
      Alert.alert('Erro', 'Erro desconhecido ao carregar usuários');
    }
  } finally {
    setLoadingList(false);
  }
};

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Criar usuário
  const handleCreate = async () => {
    if (!nome || !email) {
      Alert.alert('Erro', 'Nome e email são obrigatórios');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://suaapi.com/usuarios', {
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
      if (error instanceof Error) {
        Alert.alert('Erro', error.message || 'Erro ao carregar usuários');
    } else {
      Alert.alert('Erro', 'Erro desconhecido ao carregar usuários');
    }
}
  };

  // Deletar usuário
  const handleDelete = async (id_usuario: number) => {
    Alert.alert('Confirmação', 'Deseja deletar este usuário?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim',
        onPress: async () => {
          try {
            const res = await fetch(`https://suaapi.com/usuarios/${id_usuario}`, {
              method: 'DELETE',
            });
            if (!res.ok) throw new Error('Falha ao deletar usuário');
            Alert.alert('Sucesso', 'Usuário deletado');
            fetchUsuarios();
          } catch (error) {
            if (error instanceof Error) {
              Alert.alert('Erro', error.message || 'Erro ao deletar usuários');
          } else {
             Alert.alert('Erro', 'Erro desconhecido ao deletar usuários');
          }
          }
        },
      },
    ]);
  };

  if (loadingList) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastro de Usuário</Text>

      <Text>Nome *</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome" />

      <Text>Email *</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" autoCapitalize="none" />

      <Text>Telefone</Text>
      <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} placeholder="Telefone" keyboardType="phone-pad" />

      <Text>Localização</Text>
      <TextInput style={styles.input} value={localizacao} onChangeText={setLocalizacao} placeholder="Localização" />

      <Text>Habilidades</Text>
      <TextInput style={styles.input} value={habilidades} onChangeText={setHabilidades} placeholder="Habilidades" />

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Criar Usuário" onPress={handleCreate} />
      )}

      <Text style={styles.listTitle}>Usuários Cadastrados</Text>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id_usuario.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={{ fontWeight: 'bold' }}>{item.nome}</Text>
            <Text>{item.email}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id_usuario)} style={styles.deleteBtn}>
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
