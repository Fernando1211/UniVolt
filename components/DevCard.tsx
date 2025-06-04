import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, Linking } from "react-native";


export default function DevCard(props: any) {
  return (
    <View key={props.index} style={styles.card}>
      <View style={styles.userInfo}>
        <Image source={props.image} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{props.name}</Text>
          <Text style={styles.username}>{props.username}</Text>
        </View>
      </View>
      <View style={styles.links}>
        <TouchableOpacity onPress={() => Linking.openURL(props.linkedin)}>
          <Image
            source={require("../assets/logo-linkedin.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Linking.openURL(props.github)}>
          <Image
            source={require("../assets/logo-github.png")}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
    card: {
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      borderRadius: 16,
      padding: 12,
      marginBottom: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 100,
      marginRight: 10,

    },
    name: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
    username: {
      color: "#ddd",
      fontSize: 13,
    },
    links: {
      flexDirection: "row",
      gap: 8,
    },
    icon: {
      width: 24,
      height: 24,
      marginLeft: 15,
    },
  });