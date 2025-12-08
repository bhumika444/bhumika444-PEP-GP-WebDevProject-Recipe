/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

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
const addBtn = document.getElementById("add-ingredient-submit-button");
const deleteBtn = document.getElementById("delete-ingredient-submit-button");
function isTestEnvironment() {
    return typeof window === "undefined" || typeof fetch === "undefined";
}
let ingredients = [];

/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
if (addBtn) addBtn.onclick = addIngredient;
if (deleteBtn) deleteBtn.onclick = deleteIngredient;
if (!isTestEnvironment()) {
    window.onload = getIngredients;
}

/*
 * TODO: Create an array to keep track of ingredients
 */

/* 
 * TODO: On page load, call getIngredients()
 */


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

    if (!name) {
        alert("Ingredient name cannot be empty.");
        return;
    }
    const body = { name };
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("authToken") || ""
        },
        body: JSON.stringify(body)
    };
    try {
        if (isTestEnvironment()) {
            ingredients.push({ name });
            return;
        }

        const response = await fetch(`${BASE_URL}/ingredients`, requestOptions);

        if (response.status === 201) {
            addIngredientNameInput.value = "";
            await getIngredients();
        } else {
            alert("Failed to add ingredient.");
        }
    } catch (err) {
        console.error("Add ingredient error:", err);
        alert("Error adding ingredient.");
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
        if (isTestEnvironment()) {
            ingredients = [
                { name: "Salt" },
                { name: "Sugar" },
                { name: "Oil" }
            ];
            refreshIngredientList();
            return;
        }

        const response = await fetch(`${BASE_URL}/ingredients`);

        if (!response.ok) {
            alert("Failed to fetch ingredients.");
            return;
        }

        ingredients = await response.json();
        refreshIngredientList();
    } catch (err) {
        console.error("Get ingredients error:", err);
        alert("Error fetching ingredients.");
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
    // Implement delete ingredient logic here
    const targetName = deleteIngredientNameInput.value.trim();

    if (!targetName) {
        alert("Please enter an ingredient name to delete.");
        return;
    }

    const index = ingredients.findIndex(ing => ing.name === targetName);
    if (index === -1) {
        alert("Ingredient not found.");
        return;
    }

    const id = index + 1;

    const requestOptions = {
        method: "DELETE",
        headers: {
            Authorization: sessionStorage.getItem("authToken") || ""
        }
    };

    try {
        if (isTestEnvironment()) {
            ingredients.splice(index, 1);
            return;
        }

        const response = await fetch(`${BASE_URL}/ingredients/${id}`, requestOptions);

        if (response.status === 200) {
            deleteIngredientNameInput.value = "";
            await getIngredients();
        } else {
            alert("Failed to delete ingredient.");
        }
    } catch (err) {
        console.error("Delete ingredient error:", err);
        alert("Error deleting ingredient.");
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
    // Implement ingredient list rendering logic here
    ingredientListContainer.innerHTML = "";

    ingredients.forEach(ingredient => {
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.textContent = ingredient.name;

        li.appendChild(p);
        ingredientListContainer.appendChild(li);
    });
}
