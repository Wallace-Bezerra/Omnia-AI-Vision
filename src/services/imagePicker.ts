import * as ImagePicker from "expo-image-picker";

export const useImagePicker = () => {
  const pickImageFromLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });
      if (!result.canceled) {
        const { uri } = result.assets[0];
        return uri;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const takePicture = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });
      if (!result.canceled) {
        const { uri } = result.assets[0];
        return uri;
      }
    } catch (_) {
      console.error("File could not be selected");
    }
  };

  return { pickImageFromLibrary, takePicture };
};
