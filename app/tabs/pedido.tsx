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
  id_pedido: number;
  titulo: string;
  descricao: string;
};

type Organizacao = {
  id: number;
  nome: string;
};

export default function CadastroPedido() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [organizacoes, setOrganizacoes] = useState<Organizacao[]>([]);
  const [organizacaoSelecionada, setOrganizacaoSelecionada] = useState<number | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
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
      if (!token) throw new Error("Usuário não autenticado");

      const res = await fetch("http://192.168.15.8:8080/pedidos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Falha ao carregar pedidos");
      const data = await res.json();
      setPedidos(data);
    } catch (error) {
      Alert.alert("Erro", error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setLoadingList(false);
    }
  };

  const fetchOrganizacoes = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado");

      const res = await fetch("http://192.168.15.8:8080/organizacoes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Erro ao buscar organizações");
      const data = await res.json();
      setOrganizacoes(data);
    } catch (error) {
      Alert.alert("Erro", error instanceof Error ? error.message : "Erro desconhecido");
    }
  };

  const handleCreate = async () => {
    if (!titulo.trim() || !organizacaoSelecionada) {
      Alert.alert("Erro", "Título e organização são obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Usuário não autenticado");

      const res = await fetch("http://192.168.15.8:8080/pedidos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descricao,
          organizacaoId: organizacaoSelecionada,
        }),
      });

      if (!res.ok) throw new Error("Falha ao criar pedido");

      Alert.alert("Sucesso", "Pedido criado com sucesso");
      setTitulo("");
      setDescricao("");
      setOrganizacaoSelecionada(null);
      fetchPedidos();
    } catch (error) {
      Alert.alert("Erro", error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert("Confirmar", "Deseja realmente excluir este pedido?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            if (!token) throw new Error("Usuário não autenticado");

            const res = await fetch(`http://192.168.15.8:8080/pedidos/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!res.ok) throw new Error("Erro ao excluir pedido");
            Alert.alert("Sucesso", "Pedido excluído");
            fetchPedidos();
          } catch (error) {
            Alert.alert("Erro", error instanceof Error ? error.message : "Erro ao excluir pedido");
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
        <Text style={styles.title}>Cadastro de Pedido</Text>

        <Text style={styles.label}>Título *</Text>
        <TextInput
          style={styles.input}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Digite o título"
          placeholderTextColor="#a0a0a0"
        />

        <Text style={styles.label}>Descrição</Text>
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
            <Picker.Item label="Selecione uma organização" value={null} />
            {organizacoes.map((org) => (
              <Picker.Item key={org.id} label={org.nome} value={org.id} />
            ))}
          </Picker>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color="#3366FF" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleCreate} activeOpacity={0.85}>
            <Text style={styles.buttonText}>Criar Pedido</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.listTitle}>Pedidos Cadastrados</Text>
      </ScrollView>

      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id_pedido.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <Text style={styles.cardText}>Descrição: {item.descricao || "—"}</Text>
            <TouchableOpacity
              onPress={() => handleDelete(item.id_pedido)}
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
    backgroundColor: "#e9f0ff",
    paddingTop: Platform.OS === "android" ? 25 : 45,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#e9f0ff",
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1a237e",
    marginBottom: 28,
    alignSelf: "center",
    letterSpacing: 0.8,
  },
  label: {
    fontSize: 17,
    fontWeight: "600",
    color: "#303f9f",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 17,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#bbdefb",
    shadowColor: "#5677fc",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  deleteBtn: {
  marginTop: 12,
  backgroundColor: "#d32f2f",
  paddingVertical: 12,
  paddingHorizontal: 28,
  borderRadius: 14,
  alignSelf: "flex-start",
  shadowColor: "#8b0000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.6,
  shadowRadius: 7,
  elevation: 5,
},
deleteBtnText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 15,
},
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#bbdefb",
    marginBottom: 20,
    overflow: "hidden",
    elevation: 3,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  button: {
    backgroundColor: "#1a237e",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 36,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 18,
    letterSpacing: 1,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1a237e",
    paddingLeft: 24,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 18,
    borderRadius: 20,
    shadowColor: "#223366",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  cardTitle: {
    fontWeight: "800",
    fontSize: 20,
    color: "#1a237e",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 16,
    color: "#4250a1",
    marginBottom: 6,
  },
});
