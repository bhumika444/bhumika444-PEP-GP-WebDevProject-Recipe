/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL
const isTestEnv = typeof window === "undefined" || typeof document === "undefined";

/* 
 * TODO: Get references to various DOM elements
 * - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
 */
let usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton;
if (!isTestEnv) {
    usernameInput = document.getElementById("username");
    emailInput = document.getElementById("email");
    passwordInput = document.getElementById("password");
    repeatPasswordInput = document.getElementById("repeatPassword");
    registerButton = document.getElementById("registerBtn");

/* 
 * TODO: Ensure the register button calls processRegistration when clicked
 */
if (registerButton) {
    registerButton.addEventListener("click", processRegistration);
}
}
function safeAlert(msg) {
    if (!isTestEnv) alert(msg);
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
async function processRegistration(testData) {
    // Implement registration logic here
   
    // Example placeholder:
    
    // const registerBody = { username, email, password };
    
    // await fetch(...)
    try {
        let username, email, password, repeatPassword;
        if (isTestEnv) {
            ({ username, email, password, repeatPassword } = testData);
        } else {
            username = usernameInput?.value?.trim();
            email = emailInput?.value?.trim();
            password = passwordInput?.value?.trim();
            repeatPassword = repeatPasswordInput?.value?.trim();
        }
        if (!username || !email || !password || !repeatPassword) {
            safeAlert("All fields are required.");
            return isTestEnv ? { success: false, error: "Missing fields" } : null;
        }

        if (password !== repeatPassword) {
            safeAlert("Passwords do not match.");
            return isTestEnv ? { success: false, error: "Password mismatch" } : null;
        }
        const registerBody = {
            username,
            email,
            password
        };

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(registerBody)
        };
        const response = await fetch(`${BASE_URL}/register`, requestOptions);
        if (response.status === 201) {
            if (!isTestEnv) {
                window.location.href = "login.html";
            }
            return { success: true };
        }

        if (response.status === 409) {
            safeAlert("User or email already exists.");
            return isTestEnv ? { success: false, error: "Conflict" } : null;
        }

        safeAlert("Registration failed. Please try again.");
        return isTestEnv ? { success: false, error: "Unknown error" } : null;
       

    } catch (error) {
        console.error("Registration error:", error);
        safeAlert("An unexpected error occurred.");

        return isTestEnv ? { success: false, error: "Exception" } : null;
    }
}
