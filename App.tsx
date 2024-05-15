import { JSX, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useImageClassification } from "./src/services/imageClassification";
import { useImagePicker } from "./src/services/imagePicker";
import { styles } from "./styles";
import AudioIcon from "./src/assets/icons/audio-icon.svg";
import { stylesBottom } from "./src/styles/bottomSheet";
import { iconLanguage } from "./src/utils/languageUtils";
import { chunkArray } from "./src/utils/utils";
import { LanguageKey } from "./src/types/types";
import { speakService } from "./src/services/speak";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFValue } from "react-native-responsive-fontsize";

export default function App() {
  const [selectedImageUri, setSelectedImageUri] = useState("");
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageKey>("Português (BR)");

  const { pickImageFromLibrary, takePicture } = useImagePicker();
  const { classifyImage, results, isLoading } = useImageClassification();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%", "60%"], []);

  useEffect(() => {
    if (results.object) {
      handlePresentModalPress();
    }
  }, [results]);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleLanguageChange = (language: LanguageKey) => {
    setSelectedLanguage(language);
  };

  const renderBackdrop = useCallback(
    (props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...props} />
    ),
    []
  );

  const handleSelectImage = async () => {
    const uri = await pickImageFromLibrary();
    if (uri) {
      setSelectedImageUri(uri);
      classifyImage(uri);
    }
  };

  const pickCamera = async () => {
    const uri = await takePicture();
    if (uri) {
      setSelectedImageUri(uri);
      classifyImage(uri);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor="#1077ae" translucent />
        <View style={styles.header}>
          <Text style={styles.title}>OMNIA AI VISION</Text>
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
                style={{
                  backgroundColor: "#1077ae",
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  marginTop: 40,
                }}
                onPress={handlePresentModalPress}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: RFValue(22),
                  }}
                >
                  RESULTADO
                </Text>
              </TouchableOpacity>
            )}
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              backdropComponent={renderBackdrop}
              snapPoints={snapPoints}
              enableContentPanningGesture={false}
            >
              <BottomSheetScrollView style={stylesBottom.contentContainer}>
                {!isLoading && (
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.languague]}>{selectedLanguage}</Text>
                    <View
                      style={{
                        flexDirection: "row",
                        paddingRight: 20,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
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
                          onPress={() =>
                            speakService(
                              results.translations[selectedLanguage],
                              selectedLanguage
                            )
                          }
                          width={50}
                          height={30}
                        />
                        <Text
                          style={{
                            color: "black",
                            fontSize: RFValue(26),
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
                    </View>
                    <FlatList
                      horizontal
                      style={{
                        padding: RFValue(20),
                      }}
                      data={chunkArray(Object.keys(results.translations), 2)}
                      keyExtractor={(_, index) => index.toString()}
                      renderItem={({ item }) => (
                        <FlatList
                          horizontal
                          data={item}
                          style={{ gap: 20 }}
                          keyExtractor={(language) => language}
                          renderItem={({ item: language }) => (
                            <TouchableOpacity
                              style={[
                                styles.languageButton,
                                selectedLanguage === language &&
                                  styles.languageButtonSelected,
                              ]}
                              onPress={() =>
                                handleLanguageChange(language as LanguageKey)
                              }
                            >
                              {iconLanguage[language as LanguageKey]}
                            </TouchableOpacity>
                          )}
                          contentContainerStyle={{
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            gap: 20,
                          }}
                        />
                      )}
                      contentContainerStyle={{
                        marginTop: 20,
                        gap: 20,
                        paddingRight: 20,
                      }}
                    />
                  </View>
                )}
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
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
