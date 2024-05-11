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
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#DADADA",
    color: "#333",
  },
  languageButtonSelected: {
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 2,
    backgroundColor: "#F6F5F5",
    borderColor: "#1BABD9",
    color: "#333",
  },
  selectedLanguage: {
    backgroundColor: "#D5D5D6",
    color: "white",
  },
  languague: {
    paddingTop: 20,
    fontSize: 26,
    textTransform: "uppercase",
    fontWeight: "bold",
    textAlign: "center",
  },
});
