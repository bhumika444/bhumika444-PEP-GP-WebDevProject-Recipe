/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];
let recipeListContainer;
let adminLink;
let logoutButton;
let searchInput;

let addNameInput;
let addInstructionsInput;
let addSubmitButton;

let updateIdInput; 
let updateInstructionsInput;
let updateSubmitButton;

let deleteIdInput; 
let deleteSubmitButton;
    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function authorizedFetch(endpoint, method = 'GET', body = null) {
        const token = sessionStorage.getItem('auth-token');
        
        if (!token && endpoint !== '/login' && endpoint !== '/register') {
            return { error: true };
        }
    
        const headers = {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}` 
        };
    
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : null
            });
    
            if (response.status === 401 || response.status === 403) {
                alert("Unauthorized access or token invalid. Redirecting to login.");
                await processLogout(false);
                return { error: true };
            }
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Request failed with status ${response.status}`);
            }
            
            if (method === 'DELETE' || response.status === 204) {
                return { success: true };
            }
            
            return response.json();
    
        } catch (error) {
            alert(`API Error: ${error.message}`);
            console.error("Fetch Error:", error);
            return { error: true };
        }
    }
    async function searchRecipes(e) {
        // Implement search logic here
        if (e) e.preventDefault();
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (!searchTerm) {
            refreshRecipeList(recipes); 
            return;
        }
        const filteredRecipes = recipes.filter(recipe => 
            recipe.name.toLowerCase().includes(searchTerm)
        );

        refreshRecipeList(filteredRecipes);
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe(e) {
        // Implement add logic here
        if (e) e.preventDefault();
        const name = addNameInput.value.trim();
        const instructions = addInstructionsInput.value.trim();

        if (!name || !instructions) {
            return alert("Recipe name and instructions are required for adding.");
        }

        const newRecipe = await authorizedFetch('/recipes', 'POST', { name, instructions });
        
        if (!newRecipe.error) {
            alert(`Recipe "${name}" added successfully!`);
            addNameInput.value = '';
            addInstructionsInput.value = '';
            getRecipes();
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe(e) {
        // Implement update logic here
        if (e) e.preventDefault();
        const id = updateIdInput.value.trim(); 
        const newInstructions = updateInstructionsInput.value.trim();

        if (!id || !newInstructions) {
            return alert("Recipe ID and new instructions are required for updating.");
        }

        const result = await authorizedFetch(`/recipes/${id}`, 'PUT', { instructions: newInstructions });
        
        if (!result.error) {
            alert(`Recipe ID ${id} updated successfully!`);
            updateIdInput.value = '';
            updateInstructionsInput.value = '';
            getRecipes();
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe(e) {
        // Implement delete logic here
        if (e) e.preventDefault();
        const id = deleteIdInput.value.trim();

        if (!id) {
            return alert("Recipe ID is required for deletion.");
        }

        const result = await authorizedFetch(`/recipes/${id}`, 'DELETE');
        
        if (!result.error) {
            alert(`Recipe ID ${id} deleted successfully!`);
            getRecipes();
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        const data = await authorizedFetch('/recipes', 'GET');

        if (data && !data.error) {
            recipes = data;
            refreshRecipeList(recipes);
        } else {
            refreshRecipeList([]);
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList(recipesToDisplay) {
        // Implement refresh logic here
        recipeListContainer.innerHTML = '';
        
        if (!recipesToDisplay || recipesToDisplay.length === 0) {
            recipeListContainer.innerHTML = '<li>No recipes found.</li>';
            return;
        }
        
        recipesToDisplay.forEach(recipe => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>Recipe ID ${recipe.id}: ${recipe.name}</strong>
                <p>${recipe.instructions}</p>
            `;
            recipeListContainer.appendChild(listItem);
        });
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout(shouldRedirect = true) {
        // Implement logout logic here
        const result = await authorizedFetch('/logout', 'POST');

        sessionStorage.removeItem('auth-token');
        sessionStorage.removeItem('is-admin');
        
        if (result.error && shouldRedirect) {
            alert("Logout failed on server, but session cleared locally.");
        }
        
        if (shouldRedirect) {
            window.location.href = '../login/login-page.html';
        }
        
    }
    // Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {
    

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    recipeListContainer = document.getElementById('recipe-list');
    adminLink = document.getElementById('admin-link');
    logoutButton = document.getElementById('logout-button');
    searchInput = document.getElementById('search-input');
    addNameInput = document.getElementById('add-recipe-name-input');
    addInstructionsInput = document.getElementById('add-recipe-instructions-input');
    addSubmitButton = document.getElementById('add-recipe-submit-input');
    updateIdInput = document.getElementById('update-recipe-id-input'); 
    updateInstructionsInput = document.getElementById('update-recipe-instructions-input');
    updateSubmitButton = document.getElementById('update-recipe-submit-input');
    deleteIdInput = document.getElementById('delete-recipe-name-input'); 
    deleteSubmitButton = document.getElementById('delete-recipe-submit-input');

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    const authToken = sessionStorage.getItem('auth-token');
    const isAdmin = sessionStorage.getItem('is-admin') === 'true';
    if (!authToken) {
        alert("You must be logged in to view the recipe page.");
        return window.location.href = '../login/login-page.html';
    }
    if (logoutButton) {
        logoutButton.style.display = authToken ? 'block' : 'none';
    }
    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if (adminLink) {
        adminLink.style.display = isAdmin ? 'block' : 'none';
    }
    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    if (addSubmitButton) addSubmitButton.addEventListener('click', addRecipe);
    if (updateSubmitButton) updateSubmitButton.addEventListener('click', updateRecipe);
    if (deleteSubmitButton) deleteSubmitButton.addEventListener('click', deleteRecipe);
    if (document.getElementById('search-button')) {
        document.getElementById('search-button').addEventListener('click', searchRecipes);
    }
    if (logoutButton) logoutButton.addEventListener('click', processLogout);
    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();
    });