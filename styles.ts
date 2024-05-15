import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    width: "100%",
    height: RFValue(60),
    backgroundColor: "#1077ae",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: RFValue(20),
  },
  image: {
    width: 300,
    height: 400,
    borderRadius: 8,
    marginTop: RFValue(60),
    objectFit: "cover",
  },
  results: {
    flex: 1,
    gap: 16,
    marginTop: RFValue(64),
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
    paddingTop: RFValue(20),
    fontSize: RFValue(26),
    textTransform: "uppercase",
    fontWeight: "bold",
    textAlign: "center",
  },
});
