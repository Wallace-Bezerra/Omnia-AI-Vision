import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
    // padding: 32
  },
  header: {
    width: "100%",
    height: 90,
    backgroundColor: "#1077ae",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 25,
  },
  image: {
    width: 300,
    height: 400,
    borderRadius: 8,
    marginTop: 20,
    objectFit: "cover",
  },
  results: {
    flex: 1,
    gap: 16,
    marginTop: 64,
    paddingHorizontal: 40,
  },
  languageButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#333",
    color: "#333",
  },
  selectedLanguage: {
    backgroundColor: "#333",
    color: "white",
  },
});
