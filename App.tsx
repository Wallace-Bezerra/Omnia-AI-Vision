import { JSX, useCallback, useMemo, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import * as Speech from "expo-speech";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles";
import AudioIcon from "./assets/icons/audio-icon.svg";

import { Button } from "./components/Button";
import {
  Classification,
  ClassificationProps,
} from "./components/Classification";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { genAI } from "./lib/gemini";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { Results } from "./types/types";

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState("");

  const tags = {
    English: "en",
    Spanish: "es",
    French: "fr",
    German: "de",
    Chinese: "zh",
    "portugues-br": "pt",
    "portugues-pt": "pt",
    Italian: "it",
    Russian: "ru",
    Japanese: "ja",
    Korean: "ko",
    Arabic: "ar",
    hindi: "hi",
    Turkish: "tr",
    Polish: "pl",
    Dutch: "nl",
    Indonesian: "id",
  };

  const [results, setResults] = useState<Results>({
    object: "",
    translations: {},
  });
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%", "50%", "60%"], []);
  const [selectedLanguage, setSelectedLanguage] = useState("portugues-br");

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // const handleSheetChanges = useCallback((index: number) => {
  //   console.log("handleSheetChanges", index);
  // }, []);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  const renderBackdrop = useCallback(
    (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...props} />
    ),
    []
  );

  const speak = (text: string) => {
    const availableVoices = Speech.getAvailableVoicesAsync();
    Speech.speak(text, {
      language: tags[selectedLanguage],
      // voice: "pt-br-x-ptd-local"
    });
  };

  async function handleSelectImage() {
    setIsLoading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });

      if (!result.canceled) {
        const { uri } = result.assets[0];
        setSelectedImageUri(uri);
        await imageClassification(uri);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  const pickCamera = async () => {
    setIsLoading(true);
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });

      if (!result.canceled) {
        const { uri } = result.assets[0];
        setSelectedImageUri(uri);
        await imageClassification(uri);
      }
    } catch (_) {
      console.log("File could not be selected");
    } finally {
      setIsLoading(false);
    }
  };
  console.log("selectedLanguage", selectedLanguage);
  console.log("results state", JSON.stringify(results));
  async function imageClassification(imageUri: string) {
    setResults({
      object: "",
      translations: {},
    });
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const aspas = " ``` ";
    const prompt = `You are developing an application that requires the translation of objects identified in images into different languages. The objective is to receive the description of an object in a single word and generate a JSON file containing all possible translations of that object in the 15 most popular languages.
    
    Describe an image of an object in one word and generate a JSON file that follows the following format:
    {
      "object": "dog",
      "translations": {
        "English": "dog",
        "Spanish": "perro",
        "French": "chien",
        "German": "Hund",
        "Chinese": "狗",
        "portugues-br": "dog",
        "portugues-pt": "dog",
        "Italian": "Cane",
        "Russian": "собака",
        "Japanese": "犬",
        "Korean": "개",
        "Arabic": "كلب",
        "hindi": "कुत्ता",
        "Turkish": "Kopek",
        "Polish": "pies",
        "Dutch": "hond",
        "Indonesian": "anjing"
      }
  }
  please return only the json in the response, do not put ${aspas} json and ${aspas} at the end
    `;

    const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const image = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/png",
      },
    };
    setSelectedLanguage("portugues-br");
    const result = await model.generateContent([prompt, image]);
    console.log("result response", result);
    console.log("result text", result.response.text());

    // Verifique se o array candidates existe e se tem pelo menos um elemento

    if (result?.response?.candidates?.length > 0) {
      const parsedResult = result.response.text();
      console.log("parsedResult", parsedResult);

      // const parsedResult = JSON.parse(
      //   result.response.candidates[0].content.parts[0].text
      // );
      // console.log("parsedResult", parsedResult);
      setResults(JSON.parse(parsedResult));
      handlePresentModalPress();
    } else {
      console.error("Nenhum resultado encontrado.");
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor="#1077ae" translucent />
        <View style={styles.header}>
          <Text style={styles.title}>Omnia AI Vision</Text>
        </View>
        <Image
          source={{
            uri: selectedImageUri
              ? selectedImageUri
              : "https://teddytennis.com/usa/wp-content/uploads/sites/88/2017/11/placeholder.png",
          }}
          style={styles.image}
        />
        <BottomSheetModalProvider>
          <View style={stylesBottom.container}>
            {results?.object && (
              <TouchableOpacity
                style={{ backgroundColor: "transparent", padding: 20 }}
                onPress={handlePresentModalPress}
              >
                <Text style={{ color: "white", fontSize: 20 }}>
                  Ver Resultado...
                </Text>
              </TouchableOpacity>
            )}

            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              backdropComponent={renderBackdrop}
              snapPoints={snapPoints}
              // onChange={handleSheetChanges}
            >
              <BottomSheetScrollView style={stylesBottom.contentContainer}>
                <ScrollView>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 10,
                      paddingTop: 20,
                    }}
                  >
                    <AudioIcon
                      style={
                        {
                          // backgroundColor: "blue",
                        }
                      }
                      onPress={() =>
                        speak(results.translations[selectedLanguage])
                      }
                      width={50}
                      height={30}
                    />
                    <Text
                      style={{
                        color: "black",
                        fontSize: 26,
                        lineHeight: 26,
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        textAlign: "center",
                      }}
                    >
                      {(results &&
                        results.translations &&
                        results.translations[selectedLanguage]) ||
                        results.object}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 20,
                      padding: 20,
                      justifyContent: "space-evenly",
                      marginTop: 20,
                    }}
                  >
                    {results &&
                      results.translations &&
                      Object.keys(results.translations).map((language) => (
                        <TouchableOpacity
                          key={language}
                          onPress={() => handleLanguageChange(language)}
                        >
                          <Text
                            style={[
                              styles.languageButton,
                              selectedLanguage === language &&
                                styles.selectedLanguage,
                            ]}
                          >
                            {language}
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                </ScrollView>
              </BottomSheetScrollView>
            </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>

        {isLoading ? (
          <ActivityIndicator
            color="#1077ae"
            size={50}
            style={{
              marginBottom: 18,
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        ) : (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              gap: 40,
              paddingBottom: 10,
              width: "100%",
            }}
          >
            <TouchableOpacity
              onPress={pickCamera}
              style={{
                width: 80,
                height: 80,
                borderRadius: 80,
                backgroundColor: "#541cbb",
                position: "relative",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Feather name="camera" size={30} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSelectImage}
              style={{
                width: 80,
                height: 80,
                borderRadius: 80,
                backgroundColor: "#541cbb",
                position: "relative",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Feather name="image" size={30} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const stylesBottom = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    marginBottom: 100,
  },
});
