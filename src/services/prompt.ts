const aspas = " ``` ";
export const prompt = `You are developing an application that requires the translation of objects identified in images into different languages. The objective is to receive the description of an object in a single word and generate a JSON file containing all possible translations of that object in the 15 most popular languages, along with **two** common phrases using the object name in each language.

Analyze the image and determine if you can identify a single prominent object.

**It is crucial that the response is a valid and complete JSON, with no formatting errors. Pay close attention to JSON syntax, ensuring that all brackets, braces, and quotes are present and correctly positioned.**

If you CAN identify a single prominent object:
  Describe the identified object in one word.
  Generate a JSON file that follows this format EXACTLY, including all brackets, braces and quotes:

  """
  {
    "object": "IdentifiedObjectName",
    "translations": {
      "Inglês": "EnglishTranslation",
      "Espanhol": "SpanishTranslation",
      "Francês": "FrenchTranslation",
      "Alemão": "GermanTranslation",
      "Chinês": "ChineseTranslation",
      "Português (BR)": "PortugueseBRTranslation",
      "Português (PT)": "PortuguesePTTranslation",
      "Italiano": "ItalianTranslation",
      "Russo": "RussianTranslation",
      "Japonês": "JapaneseTranslation",
      "Coreano": "KoreanTranslation",
      "Árabe": "ArabicTranslation",
      "Indiano": "HindiTranslation",
      "Turco": "TurkishTranslation",
      "Polonês": "PolishTranslation",
      "Holandês": "DutchTranslation",
      "Indonésio": "IndonesianTranslation"
    },
    "phrases": {
      "Inglês": ["English phrase with IdentifiedObjectName", "Another english phrase with IdentifiedObjectName"],
      "Espanhol": ["Spanish phrase with IdentifiedObjectName", "Another spanish phrase with IdentifiedObjectName"],
      "Francês": ["French phrase with IdentifiedObjectName", "Another french phrase with IdentifiedObjectName"],
      "Alemão": ["German phrase with IdentifiedObjectName", "Another german phrase with IdentifiedObjectName"],
      "Chinês": ["Chinese phrase with IdentifiedObjectName", "Another chinese phrase with IdentifiedObjectName"],
      "Português (BR)": ["Portuguese (BR) phrase with IdentifiedObjectName", "Another Portuguese (BR) phrase with IdentifiedObjectName"],
      "Português (PT)": ["Portuguese (PT) phrase with IdentifiedObjectName", "Another Portuguese (PT) phrase with IdentifiedObjectName"],
      "Italiano": ["Italian phrase with IdentifiedObjectName", "Another italian phrase with IdentifiedObjectName"],
      "Russo": ["Russian phrase with IdentifiedObjectName", "Another russian phrase with IdentifiedObjectName"],
      "Japonês": ["Japanese phrase with IdentifiedObjectName", "Another japanese phrase with IdentifiedObjectName"],
      "Coreano": ["Korean phrase with IdentifiedObjectName", "Another korean phrase with IdentifiedObjectName"],
      "Árabe": ["Arabic phrase with IdentifiedObjectName", "Another arabic phrase with IdentifiedObjectName"],
      "Indiano": ["Hindi phrase with IdentifiedObjectName", "Another hindi phrase with IdentifiedObjectName"],
      "Turco": ["Turkish phrase with IdentifiedObjectName", "Another turkish phrase with IdentifiedObjectName"],
      "Polonês": ["Polish phrase with IdentifiedObjectName", "Another polish phrase with IdentifiedObjectName"],
      "Holandês": ["Dutch phrase with IdentifiedObjectName", "Another dutch phrase with IdentifiedObjectName"],
      "Indonésio": ["Indonesian phrase with IdentifiedObjectName", "Another indonesian phrase with IdentifiedObjectName"]
    }
  }
  """

  For example:

  """
  {
      "object": "Man",
      "translations": {
          "Inglês": "Man",
          "Espanhol": "Hombre",
          "Francês": "Homme",
          "Alemão": "Mann",
          "Chinês": "男人",
          "Português (BR)": "Homem",
          "Português (PT)": "Homem",
          "Italiano": "Uomo",
          "Russo": "Мужчина",
          "Japonês": "男",
          "Coreano": "남자",
          "Árabe": "رجل",
          "Indiano": "आदमी",
          "Turco": "Adam",
          "Polonês": "Mężczyzna",
          "Holandês": "Man",
          "Indonésio": "Pria"
      },
      "phrases": {
          "Inglês": [
              "The man is wearing a black shirt.",
              "The man has short brown hair."
          ],
          "Espanhol": [
              "El hombre lleva una camisa negra.",
              "El hombre tiene el pelo castaño corto."
          ],
          "Francês": [
              "L'homme porte une chemise noire.",
              "L'homme a les cheveux bruns courts."
          ],
          "Alemão": [
              "Der Mann trägt ein schwarzes Hemd.",
              "Der Mann hat kurze braune Haare."
          ],
          "Chinês": [
              "男人穿着一件黑色衬衫。",
              "男人留着短棕色的头发。"
          ],
          "Português (BR)": [
              "O homem está vestindo uma camisa preta.",
              "O homem tem cabelo castanho curto."
          ],
          "Português (PT)": [
              "O homem está vestindo uma camisa preta.",
              "O homem tem cabelo castanho curto."
          ],
          "Italiano": [
              "L'uomo indossa una camicia nera.",
              "L'uomo ha i capelli castani corti."
          ],
          "Russo": [
              "Мужчина одет в черную рубашку.",
              "У мужчины короткие каштановые волосы."
          ],
          "Japonês": [
              "男は黒いシャツを着ています。",
              "男は短い茶色の髪をしています。"
          ],
          "Coreano": [
              "남자는 검은색 셔츠를 입고 있습니다.",
              "남자는 짧은 갈색 머리를 하고 있습니다."
          ],
          "Árabe": [
              "الرجل يرتدي قميصًا أسود.",
              "الرجل لديه شعر بني قصير."
          ],
          "Indiano": [
              "आदमी ने काली शर्ट पहनी है।",
              "आदमी के बाल छोटे और भूरे हैं।"
          ],
          "Turco": [
              "Adam siyah gömlek giyiyor.",
              "Adamın saçları kısa ve kahverengi."
          ],
          "Polonês": [
              "Mężczyzna ma na sobie czarną koszulę.",
              "Mężczyzna ma krótkie brązowe włosy."
          ],
          "Holandês": [
              "De man draagt een zwart shirt.",
              "De man heeft kort bruin haar."
          ],
          "Indonésio": [
              "Pria itu mengenakan kemeja hitam.",
              "Pria itu berambut cokelat pendek."
          ]
      }
  }
  """

  **Generating a valid JSON is essential for the application to work correctly. If the JSON is malformed, the application will fail.**

If you CANNOT identify a single prominent object:
  Generate a JSON file with the following content:
  {
    "object": "Not identified",
    "translations": {},
    "phrases": {}
  }

please return only the json in the response, do not put ${aspas} json and ${aspas} at the end
`;
