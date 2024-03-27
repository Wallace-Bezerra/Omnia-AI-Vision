import { JSX, useCallback, useMemo, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
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

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState("");
  const [results, setResults] = useState<string>("");
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%", "50%", "60%"], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const renderBackdrop = useCallback(
    (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...props} />
    ),
    []
  );

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

  async function imageClassification(imageUri: string) {
    setResults("");

    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    // const prompt =
    //   "You are a plant expert, describe the type of plant in this image, answer in Portuguese Brazil";
    const prompt = `Interpret book images and provide reading recommendations based on the feeling evoked by the image. The system must be able to analyze the book cover or a selected page and identify the main feeling conveyed by the image. Based on this feeling, you should suggest books that provoke similar sensations in the reader. The goal is to create a personalized book recommendation experience, where suggestions are made based on the emotions aroused by book images. If you have patches of the books and can get a photo of them, put it in the answer.Answer in Brazilian Portuguese`;
    // const prompt =
    //   "Describe the image in a sentence, if necessary do a web search. Answer in portuguese.";

    // const prompt =
    //   `Analyze the image and identify the foods present, providing detailed information about their nutritional composition and possible related recipes. Please describe the foods found, including their common names, nutritional values per serving (such as calories, proteins, fats, carbohydrates, fibers, vitamins, and minerals), and suggestions for healthy recipes involving them. Return the information in a JSON format containing an array of objects, each object representing a food, with the following structure: { "nome": "Nome do Alimento", "descricao": "Descrição do Alimento", "informacoes_nutricionais": { "porcao": "Tamanho da Porção", "calorias": Valor em Calorias, "proteinas": Valor em Proteínas, "gorduras": Valor em Gorduras, "carboidratos": Valor em Carboidratos, "fibras": Valor em Fibras, "vitaminas": { "vitamina_A": Valor em Vitamina A, "vitamina_C": Valor em Vitamina C, ... }, "minerais": { "potassio": Valor de Potássio, "calcio": Valor de Cálcio, ... } } } Answer result portuguese brazil`;
    // const prompt =
    //   "Analyze the image and identify the chord being played on the guitar. Describe it in detail in Portuguese.";

    const imageBase64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const image = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/png",
      },
    };

    const result = await model.generateContent([prompt, image]);
    console.log(result.response.text());
    setResults(result.response.text());
    handlePresentModalPress();
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="light" backgroundColor="#1077ae" translucent />
        <View style={styles.header}>
          <Text style={styles.title}>Gemini AI</Text>
        </View>
        <Image
          source={{
            uri: selectedImageUri
              ? selectedImageUri
              : "https://teddytennis.com/usa/wp-content/uploads/sites/88/2017/11/placeholder.png",
          }}
          style={styles.image}
        />

        {/* <View style={styles.results}>
        {results.map((result) => (
          <Classification key={result.className} data={result} />
        ))}
      </View> */}
        {/* <ScrollView style={styles.results}>
          <Text
            style={{
              color: "white",
              fontSize: 20,
              lineHeight: 26,
              textAlign: "center",
            }}
          >
            {results}
          </Text>
        </ScrollView> */}

        <BottomSheetModalProvider>
          <View style={stylesBottom.container}>
            {results && (
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
              onChange={handleSheetChanges}
            >
              <BottomSheetScrollView style={stylesBottom.contentContainer}>
                <ScrollView>
                  <Text
                    style={{
                      color: "black",
                      fontSize: 18,
                      lineHeight: 26,
                      paddingVertical: 12,
                      paddingHorizontal: 20,
                      flex: 1,
                      textAlign: "center",
                    }}
                  >
                    {results}
                  </Text>
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
            {/* <Button
            onPress={pickCamera}
            title="Selecionar Camera"
            style={{
              flex: 1,
              paddingVertical: 16,
              alignItems: "center",
              backgroundColor: "#541cbb",
            }}
          /> */}
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

            {/* <Button
            style={{
              flex: 1,
              paddingVertical: 16,
              alignItems: "center",
              backgroundColor: "#1077ae",
            }}
            title="Selecionar imagem"
            onPress={handleSelectImage}
          /> */}
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
