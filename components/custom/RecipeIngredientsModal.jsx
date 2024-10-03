import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useDataGuard } from "../data/globaldata.jsx";
import { icons } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import IngredientOption from "../cartComponent/ingrediantoption.jsx";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import LoadingModalSpiral from "./LoadingModalSpiral.jsx";

const RecipeIngredientsModal = ({
  visible,
  onClose,
  IngredientOptionslist,
  ingredients,
}) => {
  const [loading, setLoading] = useState(false);
  const { user, updateData, resetData } = useDataGuard();
  const selectedIngredients = useRef(Array(ingredients.length).fill(undefined));
  useEffect(() => {
    console.log(selectedIngredients);

    return () => {};
  }, [selectedIngredients]);

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <SafeAreaView className="flex-1 p-4 bg-background-beige opacity-95">
        {/* Return Button */}
        <TouchableOpacity onPress={onClose} className="mt-[10%] mb-[12%]">
          <Image
            source={icons.back}
            className="w-10 h-10 mt-4"
            tintColor="grey"
          />
        </TouchableOpacity>
        <View className=" absolute top-[7%] right-[5%] flex-row items-center">
          <View className="flex-row items-center mr-[10%]">
            <Text className="text-2xl font-pbold " style={{ color: "black" }}>
              {" "}
              Add to Cart{" "}
            </Text>
            <Ionicons name="arrow-forward" size={30} color={"black"} />
          </View>
          <TouchableOpacity
            onPress={async () => {
              setLoading(true);
              let newlist = selectedIngredients.current.filter(
                (ingredient) => ingredient !== undefined
              );
              await updateData("cart", [...user.cart, ...newlist]);
              setLoading(false);
              onClose();
            }}
          >
            <View
              className="flex-row justify-center items-center bg-background-red px-[2%] py-[7%] rounded-full"
              style={{
                backgroundColor: "rgba(255, 204, 0, 1)",
                borderColor: "rgba(255, 204, 0, 1)",
                borderRadius: 50,
              }}
            >
              <Ionicons name={"cart"} size={45} color={"rgb(240, 0, 0)"} />
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView className="flex-1">
          {IngredientOptionslist.current &&
            ingredients.map((ingredient, index) => (
              <IngredientOption
                key={index}
                IngredientOptions={IngredientOptionslist.current[index]}
                ingredient={ingredient}
                index={index}
                selectedIngredients={selectedIngredients}
              />
            ))}
        </ScrollView>
        {loading && (
          <>
            <LoadingModalSpiral _visible={loading} _opacity={0.5} />
          </>
        )}
      </SafeAreaView>
    </Modal>
  );
};

export default RecipeIngredientsModal;

// const [query, setQuery] = useState(_query);
//     const [results, setResults] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [searchTriggered, setSearchTriggered] = useState(_autoSearch);
//     const [searchAttempted, setSearchAttempted] = useState(false);

//     const [displayRecipe, setDisplayRecipe] = useState(false); // state of the recipeModal
//     const [openRecipe, setOpenRecipe] = useState();
//     const [recipeData, setRecipeData] = useState();

//     // Effect to handle search triggering
//     useEffect(() => {
//         if (searchTriggered && query) {
//             const fetchData = async () => {
//                 setLoading(true);
//                 setSearchAttempted(true); // Mark that a search has been attempted
//                 try {
//                     const fetchedResults = await searchScript({ stringInput: query }); // Fetch search results
//                     setResults(fetchedResults);
//                     console.log(fetchedResults);
//                 } catch (error) {
//                     console.error("Error fetching results: ", error);
//                 } finally {
//                     setLoading(false);
//                     setSearchTriggered(false); // Reset the flag after search
//                 }
//             };

//             fetchData();
//         }
//     }, [searchTriggered, query]);

//     // Effect to reset state when modal opens
//     useEffect(() => {
//         if (_recipeIngredientsMode) {
//             // Reset all relevant state variables
//             setQuery(_query);
//             setResults([]);
//             setLoading(false);
//             setSearchTriggered(_autoSearch);
//             setSearchAttempted(false);
//         }
//     }, [_recipeIngredientsMode]);

//     const handleSearch = () => {
//         if (query) {
//             setSearchTriggered(true);
//         } // Set the flag to true to trigger the effect
//     };

//     const pressHandeler = async (result) => {
//         let recipe = await extractRecipe({ recipeURL: result.href });
//         setRecipeData(recipe);
//         setDisplayRecipe(true);
//     };

//     const saveRecipeHandeler = (item) => {
//         updateData("recipes", [...user.recipes, item]);
//     };

//     return (
//         <Modal
//             visible={_recipeIngredientsMode}
//             transparent={true}
//             animationType="fade"
//             className="flex-1"
//         >
//             {/* Extract recipe modal */}
//             <RecipeModal
//                 _state={displayRecipe}
//                 _toggleRecipeMode={() => {
//                     setDisplayRecipe(!displayRecipe);
//                 }}
//                 _recipe={openRecipe}
//                 _recipeData={recipeData}
//             />

//             <View className="flex-1 p-4 bg-background-offwhite opacity-95">
//                 {/* Return Button */}
//                 <TouchableOpacity onPress={_toggleSearchMode}>
//                     <Image
//                         source={icons.back}
//                         className="w-10 h-10 mt-[10%]"
//                         tintColor="grey"
//                     />
//                 </TouchableOpacity>

//                 {/* Search Bar */}
//                 <View className="my-4">
//                     <View className="flex-row items-center bg-background-shadow p-3 rounded-full shadow-sm opacity-[0.7]">
//                         <TextInput
//                             placeholder={_title}
//                             className="flex-1 color-offwhite text-bold"
//                             placeholderTextColor={"white"}
//                             maxLength={15}
//                             value={query}
//                             onChangeText={setQuery}
//                         />
//                         <TouchableOpacity onPress={handleSearch}>
//                             <Image source={icons.search} className="w-6 h-6 mr-2" />
//                         </TouchableOpacity>
//                     </View>

//                     {/* Displaying Search Results */}
//                     {loading ? (
//                         <LoadingDots />
//                     ) : searchAttempted && results.length === 0 ? (
//                         <View className="items-center justify-center mt-[20px]">
//                             <Text className="color-gray text-[18px] font-medium">
//                                 No recipes found 😞
//                             </Text>
//                             <Text className="text-[14px] color-gray mt-[5px]">
//                                 Try adjusting your search criteria.
//                             </Text>
//                         </View>
//                     ) : (
//                         <ScrollView className="mt-[20]">
//                             {results.map((result, index) => (
//                                 <View
//                                     key={index}
//                                     style={{ position: "relative", marginBottom: 20 }}
//                                 >
//                                     <TouchableOpacity
//                                         className="flex-row items-center"
//                                         onPress={() => {
//                                             pressHandeler(result);
//                                             setOpenRecipe(result);
//                                         }}
//                                     >
//                                         {/* Image & Heart Button*/}
//                                         <View style={{ position: "relative" }}>
//                                             <Image
//                                                 source={{ uri: result.photosrc }}
//                                                 className="w-36 h-24"
//                                                 resizeMode="cover"
//                                             />
//                                             <HeartButton
//                                                 onPress={() => {
//                                                     console.log(`Liked recipe: ${result.title}`);
//                                                     saveRecipeHandeler(result);
//                                                 }}
//                                             />
//                                         </View>
//                                         <Text className="font-bold text-[16px] ml-4 my-auto flex-shrink">
//                                             {result.title}
//                                         </Text>
//                                     </TouchableOpacity>

//                                     {/* Horizontal line */}
//                                     <View
//                                         style={{
//                                             height: 1,
//                                             backgroundColor: "gray",
//                                             marginVertical: 10,
//                                         }}
//                                     />
//                                 </View>
//                             ))}
//                         </ScrollView>
//                     )}
//                 </View>
//             </View>
//         </Modal>
//     );
// };

// export default RecipeIngredientsModal;
