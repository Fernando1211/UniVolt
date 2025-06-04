import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const pedidos = [
  {
    id_pedido: 1,
    descricao: 'Precisamos de doações de roupas',
    prioridade: 'Alta',
    data_pedido: '2025-05-29',
    organizacao: 'ONG A',
    status: 'Aberto',
  },
  {
    id_pedido: 2,
    descricao: 'Ajuda para reconstrução',
    prioridade: 'Média',
    data_pedido: '2025-05-28',
    organizacao: 'Prefeitura X',
    status: 'Em andamento',
  },
];

export default function Pedido() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pedidos</Text>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id_pedido.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.desc}>{item.descricao}</Text>
            <Text>Prioridade: {item.prioridade}</Text>
            <Text>Data: {item.data_pedido}</Text>
            <Text>Organização: {item.organizacao}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  card: {
    backgroundColor: '#eee',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  desc: { fontWeight: 'bold', marginBottom: 4 },
});
