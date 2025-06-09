import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";



type Pedido = {
  id: number;
  descricao: string;
  dataPedido: string;
  status: string;
  organizacao: { id: number; nome?: string };
};

type Organizacao = {
  id: number;
  nome: string;
};

export default function CadastroPedido() {
  const [descricao, setDescricao] = useState("");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [organizacoes, setOrganizacoes] = useState<Organizacao[]>([]);
  const [organizacaoSelecionada, setOrganizacaoSelecionada] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    fetchPedidos();
    fetchOrganizacoes();
  }, []);

  const fetchPedidos = async () => {
    setLoadingList(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const res = await fetch(`http://192.168.15.8:8080/pedidos`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao buscar pedidos");
      const data = await res.json();
      setPedidos(data.content || data);
    } catch (error) {
      console.error("Erro ao carregar pedidos", error);
      Alert.alert("Erro", error instanceof Error ? error.message : "Erro desconhecido");
      setPedidos([]);
    } finally {
      setLoadingList(false);
    }
  };

  const fetchOrganizacoes = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const res = await fetch(`http://192.168.15.8:8080/organizacoes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao buscar organizações");
      const data = await res.json();
      const lista = data.content || data;

      if (!Array.isArray(lista)) throw new Error("Formato inválido de organizações");

      setOrganizacoes(lista);
      if (lista.length > 0) setOrganizacaoSelecionada(lista[0].id);
    } catch (error) {
      console.error("Erro ao carregar organizações", error);
      Alert.alert("Erro", error instanceof Error ? error.message : "Erro ao buscar organizações");
      setOrganizacoes([]);
    }
  };

  const handleCreate = async () => {
    if (!descricao.trim() || !organizacaoSelecionada) {
      Alert.alert("Erro", "Descrição e organização são obrigatórias");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const payload = {
        descricao,
        organizacaoId: organizacaoSelecionada ,
      };

      console.log("Payload:", payload);

      const res = await fetch(`http://192.168.15.8:8080/pedidos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Erro ao criar pedido");

      Alert.alert("Sucesso", "Pedido cadastrado com sucesso");
      setDescricao("");
      fetchPedidos();
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      Alert.alert("Erro", error instanceof Error ? error.message : "Erro ao salvar o pedido");
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.title}>Cadastro de Pedido</Text>

        <Text style={styles.label}>Descrição *</Text>
        <TextInput
          style={styles.input}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Descreva o pedido"
          placeholderTextColor="#a0a0a0"
        />

        <Text style={styles.label}>Organização *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={organizacaoSelecionada}
            onValueChange={(itemValue) => setOrganizacaoSelecionada(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Selecione a organização" value={null} />
            {Array.isArray(organizacoes) &&
              organizacoes.map((org) => (
                <Picker.Item key={org.id} label={org.nome} value={org.id} />
              ))}
          </Picker>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color="#3366FF" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleCreate}>
            <Text style={styles.buttonText}>Criar Pedido</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.listTitle}>Pedidos Cadastrados</Text>
      </ScrollView>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.descricao}</Text>
            <Text style={styles.cardText}>Status: {item.status}</Text>
            <Text style={styles.cardText}>Data: {item.dataPedido}</Text>
            <Text style={styles.cardText}>Organização: {item.organizacao?.nome || item.organizacao?.id}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e9f0ff", paddingTop: Platform.OS === "android" ? 25 : 45 },
  loadingContainer: { flex: 1, justifyContent: "center", backgroundColor: "#e9f0ff" },
  formContainer: { paddingHorizontal: 24, paddingBottom: 20 },
  title: { fontSize: 30, fontWeight: "800", color: "#1a237e", marginBottom: 28, alignSelf: "center" },
  label: { fontSize: 17, fontWeight: "600", color: "#303f9f", marginBottom: 8 },
  input: {
    backgroundColor: "#fff", paddingVertical: 14, paddingHorizontal: 18, fontSize: 17,
    borderRadius: 14, marginBottom: 20, borderWidth: 1, borderColor: "#bbdefb",
    shadowColor: "#5677fc", shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
  },
  pickerContainer: {
    backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#bbdefb", marginBottom: 20,
    overflow: "hidden", elevation: 3,
  },
  picker: { height: 50, width: "100%" },
  button: {
    backgroundColor: "#1a237e", paddingVertical: 16, borderRadius: 16, alignItems: "center", marginBottom: 36,
    shadowColor: "#000", shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
  buttonText: { color: "#fff", fontWeight: "800", fontSize: 18 },
  listTitle: { fontSize: 24, fontWeight: "700", marginBottom: 16, color: "#1a237e", paddingLeft: 24 },
  card: {
    backgroundColor: "#fff", padding: 20, marginHorizontal: 24, marginBottom: 18, borderRadius: 20,
    shadowColor: "#223366", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 6,
  },
  cardTitle: { fontWeight: "800", fontSize: 20, color: "#1a237e", marginBottom: 8 },
  cardText: { fontSize: 16, color: "#4250a1", marginBottom: 6 },
});
