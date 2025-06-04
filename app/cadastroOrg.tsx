import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator, Alert, FlatList, TouchableOpacity } from 'react-native';
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
  if (error instanceof Error) {
    console.log(error.message);
  } else {
    console.log("Erro desconhecido:", error);
  }
}}

  const handleCreate = async () => {
    if (!nome || !tipo) {
      Alert.alert('Erro', 'Nome e tipo são obrigatórios');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://suaapi.com/organizacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, tipo, contato }),
      });
      if (!res.ok) throw new Error('Falha ao criar organização');
      Alert.alert('Sucesso', 'Organização criada');
      setNome('');
      setTipo(null);
      setContato('');
      fetchOrganizacoes();
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Erro desconhecido:", error);
      }
  };

  const handleDelete = async (id_organizacao: number) => {
    Alert.alert('Confirmação', 'Deseja deletar esta organização?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sim',
        onPress: async () => {
          try {
            const res = await fetch(`https://suaapi.com/organizacoes/${id_organizacao}`, {
              method: 'DELETE',
            });
            if (!res.ok) throw new Error('Falha ao deletar organização');
            Alert.alert('Sucesso', 'Organização deletada');
            fetchOrganizacoes();
            } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Erro', error.message || 'Erro ao deletar organização');
            } else {
              Alert.alert('Erro', 'Erro desconhecido ao deletar organização');
            }
          }
        },
      },
    ]);
  };

  if (loadingList) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastro de Organização</Text>

      <Text>Nome *</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome da organização" />

      <Text>Tipo *</Text>
      <Picker selectedValue={tipo} onValueChange={(v) => setTipo(v)}>
        <Picker.Item label="Selecione o tipo" value={null} />
        {tipos.map((t) => (
          <Picker.Item key={t} label={t} value={t} />
        ))}
      </Picker>

      <Text>Contato</Text>
      <TextInput style={styles.input} value={contato} onChangeText={setContato} placeholder="Telefone ou email" />

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Button title="Criar Organização" onPress={handleCreate} />
      )}

      <Text style={styles.listTitle}>Organizações Cadastradas</Text>
      <FlatList
        data={organizacoes}
        keyExtractor={(item) => item.id_organizacao.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={{ fontWeight: 'bold' }}>{item.nome}</Text>
            <Text>Tipo: {item.tipo}</Text>
            <Text>Contato: {item.contato}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id_organizacao)} style={styles.deleteBtn}>
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
})
}