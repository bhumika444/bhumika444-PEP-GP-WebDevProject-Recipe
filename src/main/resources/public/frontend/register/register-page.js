/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
 */
const usernameInput = document.getElementById("username-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const repeatPasswordInput = document.getElementById("repeat-password-input");
const registerButton = document.getElementById("register-button");
/* 
 * TODO: Ensure the register button calls processRegistration when clicked
 */
if (registerButton) {
    registerButton.addEventListener('click', processRegistration);
}
/**
 * TODO: Process Registration Function
 * 
 * Requirements:
 * - Retrieve username, email, password, and repeat password from input fields
 * - Validate all fields are filled
 * - Check that password and repeat password match
 * - Create a request body with username, email, and password
 * - Define requestOptions using method POST and proper headers
 * 
 * Fetch Logic:
 * - Send POST request to `${BASE_URL}/register`
 * - If status is 201:
 *      - Redirect user to login page
 * - If status is 409:
 *      - Alert that user/email already exists
 * - Otherwise:
 *      - Alert generic registration error
 * 
 * Error Handling:
 * - Wrap in try/catch
 * - Log error and alert user
 */
async function processRegistration(event) {
    // Implement registration logic here
    if (event) {
        event.preventDefault();
    }
    // Example placeholder:
    const username = usernameInput ? usernameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value.trim() : '';
    const repeatPassword = repeatPasswordInput ? repeatPasswordInput.value.trim() : '';
    if (!username || !email || !password || !repeatPassword) {
        return alert("All fields must be filled out.");
    }
    if (password !== repeatPassword) {
        return alert("Password and Repeat Password must match.");
    }
    // const registerBody = { username, email, password };
    const registerBody = { username, email, password };
const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(registerBody)
    };
    // await fetch(...)
    try {
        const response = await fetch(`${BASE_URL}/register`, requestOptions);

        if (response.status === 201) {
            alert("Registration successful! Please log in.");
            window.location.href = '../login/login-page.html';
        
        } else if (response.status === 409) {
            const errorText = await response.text();
            alert(`Registration Failed: ${errorText}`);
            
        } else {
            alert(`Registration Failed: Unknown server error (Status ${response.status}).`);
        }

    } catch (error) {
        console.error("Network or Unexpected Error during registration:", error);
        alert("A network error occurred. Could not connect to the server.");
    }
}
