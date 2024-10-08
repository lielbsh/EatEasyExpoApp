import { View, Text, Image, ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import backgroundImage from "../../assets/images/background5.png";
import { images } from "../../constants";
import Header from "../../components/custom/Header";
import DeleteButton from "../../components/custom/deleteButton";
import LibraryCard from "../../components/recipesComponent/LibraryCard";
import RecipeModal from "../../components/recipesComponent/RecipeModal.jsx";
import { extractRecipe } from "../../scripts/puppeteer/extractRecipe";
import { useDataGuard } from "../../components/data/globaldata.jsx";
import LoadingModalSpiral from "../../components/custom/LoadingModalSpiral.jsx";

const Recipes = () => {
  const { user, updateData, resetData } = useDataGuard();
  const [displayRecipe, setDisplayRecipe] = useState(false);
  const [openRecipe, setOpenRecipe] = useState();
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false); // Track recipe loading

  const [recipeData, setRecipeData] = useState();
  const handelState = async (recipeUrl) => {
    setIsLoadingRecipe(true); // Start loading spinner
    try {
      let recipe = await extractRecipe({ recipeURL: recipeUrl });
      setRecipeData(recipe);
      setDisplayRecipe(true);
    } catch (error) {
      console.log("Error fetching recipe:", error);
    } finally {
      setIsLoadingRecipe(false); // Stop loading spinner
    }
  };

  // Function to toggle search mode
  const togglehRecipeMode = () => {
    setDisplayRecipe(!displayRecipe);
  };

  // Helper function to remove saved recipe
  const deletRecipeHandler = (recipeToDelete) => {
    const updatedRecipes = user.recipes.filter(
      (recipe) => recipe !== recipeToDelete
    );
    updateData("recipes", updatedRecipes);
    updateData("changes",[...user.changes,['DELETE',recipeToDelete]])
    console.log("item removed");
  };

  return (
    <SafeAreaView className="h-full" edges={["top", "left", "right"]}>
      <RecipeModal
        _state={displayRecipe}
        _toggleRecipeMode={togglehRecipeMode}
        _recipe={openRecipe}
        _recipeData={recipeData}
      />

      <LoadingModalSpiral _visible={isLoadingRecipe} _opacity={0.25} />

      <Header color={"#fff5dc"} />

      <View
        className="items-center "
        style={{ backgroundColor: "rgba(255, 254, 252,0)" }}
      >
        <Text className="text-3xl font-psemibold color-offwhite ">
          Recipes Library
        </Text>
        <Text className="text-1xl font-psemibold color-white ">
          Your collection of favorite recipes
        </Text>
      </View>

      <ScrollView style={{ zIndex: 1 }}>
        <View className="flex-row flex-wrap">
          {user.recipes.map((item) => (
            <View className="w-1/2 p-3 h-[220px]" key={item.title}>
              <LibraryCard
                inputText="bg-background-beige"
                item={item}
                handelPress={() => {
                  setOpenRecipe(item);
                  handelState(item.href);
                }}
              />
              <DeleteButton
                handlePress={() => {
                  deletRecipeHandler(item);
                }}
                activeOpacity={0.7}
                contaniorstyles="absolute w-[19%] h-[13%] top-[10%] right-[8%]"
                size={25}
                color="#F1684B"
              />
            </View>
          ))}
        </View>
      </ScrollView>

      <View
        className="absolute h-[full] w-[full] top-[0px] left-0 "
        style={{ backgroundColor: "rgba(58, 86, 44,0.7)", zIndex: -2 }}
      >
        <Image
          source={backgroundImage}
          className=" h-[full] w-[full] top-[0px] left-0"
          style={{ opacity: 1, zIndex: -1, tintColor: "#3A562C" }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Recipes;
