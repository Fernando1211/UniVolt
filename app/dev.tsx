import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DevCard from "../components/DevCard";
 
const profiles = [
  {
    name: "Gabrielly Macedo",
    username: "gabimaced0",
    image: require("../assets/gabimacedo-pic.png"),
    linkedin:
      "https://www.linkedin.com/in/gabrielly-macedo-b6138027b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    github: "https://github.com/gabimaced0",
  },
  {
    name: "Fernando Aguiar",
    username: "fernando1211",
    image: require("../assets/fernandoaguiar-pic.jpg"),
    linkedin:
      "https://www.linkedin.com/in/fernando-henrique-vilela-aguiar-322aa2301/",
    github: "https://github.com/fernando1211",
  },
  {
    name: "Rafael Magalhães",
    username: "RafaMacoto",
    image: require("../assets/rafamocoto.jpg"),
    linkedin: "http://linkedin.com/in/rafael-macoto",
    github: "https://github.com/RafaMacoto",
  },
];
 
export default function Devs() {
  return (
    <View style={styles.background}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.devList}
          showsVerticalScrollIndicator={false}
        >
          {profiles.map((profile, index) => (
            <DevCard key={index} {...profile} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
 
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor:"#bddaec"
  },
  container: {
    flex: 1,
    marginHorizontal: 16,
    alignItems: "center",
    paddingVertical: 20,
  },
  devList: {
    alignItems: "center",
    paddingBottom: 40,
    width: "100%",
  },
});
 