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
import { Picker } from "@react-native-picker/picker";

type Pedido = {
  id_pedido: number;
  titulo: string;
  descricao: string;
  prioridade: "ALTA" | "MEDIA" | "BAIXA";
};

const prioridades = ["ALTA", "MEDIA", "BAIXA"];

export default function CadastroPedido() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState<"ALTA" | "MEDIA" | "BAIXA" | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    setLoadingList(true);
    try {
      const res = await fetch("https://localhost:8080/pedidos");
      if (!res.ok) throw new Error("Falha ao carregar pedidos");
      const data = await res.json();
      setPedidos(data);
    } catch (error) {
      Alert.alert("Erro", error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setLoadingList(false);
    }
  };

  const handleCreate = async () => {
    if (!titulo.trim() || !prioridade) {
      Alert.alert("Erro", "Título e prioridade são obrigatórios");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("https://localhost:8080/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, descricao, prioridade }),
      });
      if (!res.ok) throw new Error("Falha ao criar pedido");
      Alert.alert("Sucesso", "Pedido criado");
      setTitulo("");
      setDescricao("");
      setPrioridade(null);
      fetchPedidos();
    } catch (error) {
      Alert.alert("Erro", error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
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

        <Text style={styles.label}>Prioridade *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={prioridade}
            onValueChange={(itemValue) => setPrioridade(itemValue as "ALTA" | "MEDIA" | "BAIXA")}
            style={styles.picker}
          >
            <Picker.Item label="Selecione a prioridade" value={null} />
            {prioridades.map((p) => (
              <Picker.Item key={p} label={p} value={p} />
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
            <Text style={styles.cardText}>Descrição: {item.descricao || '—'}</Text>
            <Text style={styles.cardText}>Prioridade: {item.prioridade}</Text>
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
