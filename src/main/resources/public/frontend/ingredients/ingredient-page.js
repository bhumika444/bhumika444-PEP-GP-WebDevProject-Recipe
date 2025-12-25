// /**
//  * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
//  */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
const addIngredientNameInput = document.getElementById("add-ingredient-name-input");
const deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
const ingredientListContainer = document.getElementById("ingredient-list");

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
const addBtn = document.getElementById("add-ingredient-submit-button");
const deleteBtn = document.getElementById("delete-ingredient-submit-button");

/*
 * TODO: Create an array to keep track of ingredients
 */let ingredients = [];
if (addBtn) addBtn.onclick = addIngredient;
if (deleteBtn) deleteBtn.onclick = deleteIngredient;
/* 
 * TODO: On page load, call getIngredients()
 */
window.addEventListener("load", () => {
  getIngredients();
});
// small helper for auth header
function getAuthHeaders(isJson = false) {
  const token = sessionStorage.getItem("auth-token") || "";
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}
/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here
    const name = addIngredientNameInput.value.trim();
    if (!name) return;
    try {
      const response = await fetch(`${BASE_URL}/ingredients`, {
      method: "POST",
      headers: getAuthHeaders(true),
      body: JSON.stringify({ name })
    });

    // backend might return 200 or 201 depending on implementation
    if (response.ok) {
      addIngredientNameInput.value = "";
      await getIngredients();
    }
  } catch (err) {
    console.error("Add ingredient error:", err);
  }
}
/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    try {
      const response = await fetch(`${BASE_URL}/ingredients`, {
        method: "GET",
        headers: getAuthHeaders(false)
      });
  
      if (!response.ok) {
        ingredients = [];
        refreshIngredientList();
        return;
      }
  
      ingredients = await response.json();
      refreshIngredientList();
    } catch (err) {
      console.error("Get ingredients error:", err);
      ingredients = [];
      refreshIngredientList();
    }
  }
/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
  const targetName = deleteIngredientNameInput.value.trim();
  if (!targetName) return;

  // Find ingredient from stored array (use backend-provided id)
  const match = ingredients.find(i => i.name.toLowerCase() === targetName.toLowerCase());
  if (!match) return;

  try {
    const response = await fetch(`${BASE_URL}/ingredients/${match.id}`, {
      method: "DELETE",
      headers: getAuthHeaders(false)
    });

    // backend might return 200 or 204
    if (response.ok || response.status === 204) {
      deleteIngredientNameInput.value = "";
      await getIngredients();
    }
  } catch (err) {
    console.error("Delete ingredient error:", err);
  }
}
/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
//     // Implement ingredient list rendering logic here
ingredientListContainer.innerHTML = "";

  ingredients.forEach(ingredient => {
    const li = document.createElement("li");
    const p = document.createElement("p");
    p.textContent = ingredient.name;

    li.appendChild(p);
    ingredientListContainer.appendChild(li);
  });
}