import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const menuItems = [
  { label: 'Usuário', icon: 'person', route: '/cadastroUsuario' },
  { label: 'Voluntário', icon: 'volunteer-activism', route: '/cadastroVoluntario' },
  { label: 'Organizações', icon: 'apartment', route: '/cadastroOrg' },
  { label: 'Pedidos', icon: 'assignment', route: '/pedido' },
  { label: 'Participações', icon: 'group', route: '/participacoes' },
  { label: 'Oportunidades', icon: 'work', route: '/oportunidades' },
];

export default function Home() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#4A90E2', '#357ABD']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Voluntariado App</Text>
        <Text style={styles.subheader}>Conectando pessoas e oportunidades</Text>

        <View style={styles.grid}>
          {menuItems.map(({ label, icon, route }) => (
            <TouchableOpacity
              key={route}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => router.push(route)}
            >
              <MaterialIcons name={icon} size={48} color="#357ABD" style={styles.cardIcon} />
              <Text style={styles.cardLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.footer}>© 2025 Sua Organização • Todos os direitos reservados</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const CARD_SIZE = (width - 72) / 2; // considerando padding horizontal e espaçamento

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    paddingVertical: 50,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  header: {
    fontSize: 34,
    fontWeight: '900',
    color: 'white',
    marginBottom: 8,
    letterSpacing: 1.2,
  },
  subheader: {
    fontSize: 16,
    color: '#d0e2ff',
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: CARD_SIZE,
    height: CARD_SIZE,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    padding: 16,
  },
  cardIcon: {
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#357ABD',
    textAlign: 'center',
  },
  footer: {
    color: 'rgba(255,255,255,0.6)',
    marginTop: 40,
    fontSize: 14,
    fontWeight: '500',
  },
});
