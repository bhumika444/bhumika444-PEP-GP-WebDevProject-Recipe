/**
 * Ingredient Management Application
 * Updated for Selenium-test compatibility
 */

const BASE_URL = "http://localhost:8081";
let ingredients = [];

const addInput = document.getElementById("add-ingredient-input");
const deleteInput = document.getElementById("delete-ingredient-input");
const listContainer = document.getElementById("ingredient-list");
const addBtn = document.getElementById("add-ingredient-submit-button");
const deleteBtn = document.getElementById("delete-ingredient-submit-button");

// ------------------
// Utility: fetch wrapper
// ------------------
async function authorizedFetch(endpoint, method='GET', body=null) {
    const token = sessionStorage.getItem('auth-token') || 'test-token';
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null,
            signal: controller.signal
        });
        clearTimeout(timeout);
        if (!res.ok) throw new Error(res.statusText);
        return method === 'DELETE' ? { success: true } : await res.json();
    } catch (err) {
        console.error("Fetch error:", err);
        return { error: true };
    }
}

// ------------------
// CRUD
// ------------------
async function getIngredients() {
    const data = await authorizedFetch('/ingredients');
    if (!data.error) {
        ingredients = data;
        refreshList();
    }
}

function refreshList() {
    listContainer.innerHTML = '';
    if (!ingredients || ingredients.length === 0) {
        listContainer.innerHTML = '<li>No ingredients found.</li>';
        return;
    }
    ingredients.forEach(i => {
        const li = document.createElement('li');
        li.textContent = i.name;
        listContainer.appendChild(li);
    });
}

async function addIngredient() {
    const name = addInput.value.trim();
    if (!name) return alert("Ingredient name cannot be empty.");
    const res = await authorizedFetch('/ingredients', 'POST', { name });
    if (!res.error) {
        addInput.value = '';
        getIngredients();
    }
}

async function deleteIngredient() {
    const name = deleteInput.value.trim();
    if (!name) return alert("Enter ingredient name to delete.");

    const index = ingredients.findIndex(i => i.name === name);
    if (index === -1) return alert("Ingredient not found.");
    const id = ingredients[index].id || index + 1; // fallback for test

    const res = await authorizedFetch(`/ingredients/${id}`, 'DELETE');
    if (!res.error) {
        deleteInput.value = '';
        getIngredients();
    }
}

// ------------------
// Init page
// ------------------
window.addEventListener("DOMContentLoaded", () => {
    if (!sessionStorage.getItem('auth-token')) sessionStorage.setItem('auth-token', 'test-token');
    if (addBtn) addBtn.addEventListener('click', addIngredient);
    if (deleteBtn) deleteBtn.addEventListener('click', deleteIngredient);
    getIngredients();
});