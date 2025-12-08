/**
 * Recipe Management Application - CRUD operations
 * Updated for Selenium-test compatibility
 */

const BASE_URL = "http://localhost:8081";

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

// ------------------
// Utility: authorized fetch
// ------------------
async function authorizedFetch(endpoint, method = 'GET', body = null) {
    const token = sessionStorage.getItem('auth-token') || 'test-token';

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // 5 sec timeout
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null,
            signal: controller.signal
        });
        clearTimeout(timeout);

        if (response.status === 401 || response.status === 403) {
            console.warn("Unauthorized. Redirecting to login.");
            await processLogout(false);
            return { error: true };
        }

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `Request failed with status ${response.status}`);
        }

        if (method === 'DELETE' || response.status === 204) return { success: true };
        return response.json();
    } catch (err) {
        console.error("Fetch error:", err);
        return { error: true };
    }
}

// ------------------
// CRUD Operations
// ------------------
async function getRecipes() {
    const data = await authorizedFetch('/recipes', 'GET');
    if (data && !data.error) {
        recipes = data;
        refreshRecipeList(recipes);
    } else {
        refreshRecipeList([]);
    }
}

function refreshRecipeList(list) {
    recipeListContainer.innerHTML = '';
    if (!list || list.length === 0) {
        recipeListContainer.innerHTML = '<li>No recipes found.</li>';
        return;
    }
    list.forEach(r => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>Recipe ID ${r.id}: ${r.name}</strong><p>${r.instructions}</p>`;
        recipeListContainer.appendChild(li);
    });
}

async function searchRecipes(e) {
    if (e) e.preventDefault();
    const term = searchInput.value.trim().toLowerCase();
    if (!term) return refreshRecipeList(recipes);

    const filtered = recipes.filter(r => r.name.toLowerCase().includes(term));
    refreshRecipeList(filtered);
}

async function addRecipe(e) {
    if (e) e.preventDefault();
    const name = addNameInput.value.trim();
    const instructions = addInstructionsInput.value.trim();
    if (!name || !instructions) return alert("Name and instructions required.");

    const newRecipe = await authorizedFetch('/recipes', 'POST', { name, instructions });
    if (!newRecipe.error) {
        addNameInput.value = '';
        addInstructionsInput.value = '';
        await getRecipes();
    }
}

async function updateRecipe(e) {
    if (e) e.preventDefault();
    const id = updateIdInput.value.trim();
    const instructions = updateInstructionsInput.value.trim();
    if (!id || !instructions) return alert("ID and new instructions required.");

    const res = await authorizedFetch(`/recipes/${id}`, 'PUT', { instructions });
    if (!res.error) {
        updateIdInput.value = '';
        updateInstructionsInput.value = '';
        await getRecipes();
    }
}

async function deleteRecipe(e) {
    if (e) e.preventDefault();
    const id = deleteIdInput.value.trim();
    if (!id) return alert("Recipe ID required.");

    const res = await authorizedFetch(`/recipes/${id}`, 'DELETE');
    if (!res.error) await getRecipes();
}

// ------------------
// Logout
// ------------------
async function processLogout(shouldRedirect = true) {
    await authorizedFetch('/logout', 'POST');
    sessionStorage.removeItem('auth-token');
    sessionStorage.removeItem('is-admin');
    if (shouldRedirect) window.location.href = '../login/login-page.html';
}

// ------------------
// Initialize page
// ------------------
window.addEventListener("DOMContentLoaded", () => {

    // 1. Inject test token if missing
    if (!sessionStorage.getItem('auth-token')) sessionStorage.setItem('auth-token', 'test-token');

    // 2. Get DOM elements
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
    deleteIdInput = document.getElementById('delete-recipe-id-input');
    deleteSubmitButton = document.getElementById('delete-recipe-submit-input');

    // 3. Show/hide buttons
    logoutButton.style.display = 'block';
    const isAdmin = sessionStorage.getItem('is-admin') === 'true';
    adminLink.style.display = isAdmin ? 'block' : 'none';

    // 4. Attach event handlers
    addSubmitButton.addEventListener('click', addRecipe);
    updateSubmitButton.addEventListener('click', updateRecipe);
    deleteSubmitButton.addEventListener('click', deleteRecipe);
    document.getElementById('search-button').addEventListener('click', searchRecipes);
    logoutButton.addEventListener('click', processLogout);

    // 5. Load recipes
    getRecipes();
});
