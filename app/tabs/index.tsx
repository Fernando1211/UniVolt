import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#4A90E2', '#357ABD']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Botão de login no topo */}
        <View style={styles.loginBtnContainer}>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.header}>Voluntariado App</Text>
        <Text style={styles.subheader}>Conectando pessoas e oportunidades</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const CARD_SIZE = (width - 72) / 2;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    paddingVertical: 50,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  loginBtnContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  loginBtn: {
    backgroundColor: '#ffffff30',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'white',
  },
  loginText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
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
});
