/**
 * This script handles the login functionality for the Recipe Management Application.
 * It manages user authentication by sending login requests to the server and handling responses.
*/
const BASE_URL = "http://localhost:8081"; // backend URL
const isTestEnv = typeof window === "undefined" || typeof document === "undefined";

/* 
 * TODO: Get references to DOM elements
 * - username input
 * - password input
 * - login button
 * - logout button (optional, for token testing)
 */
let usernameInput, passwordInput, loginButton, logoutButton;
if (!isTestEnv) {
    usernameInput = document.getElementById("login-input");
    passwordInput = document.getElementById("password-input");
    loginButton = document.getElementById("login-button");
    logoutButton = document.getElementById("logout-button");

/* 
 * TODO: Add click event listener to login button
 * - Call processLogin on click
 */
if (loginButton) {
    loginButton.addEventListener("click", processLogin);
}
}
function safeAlert(msg) {
    if (!isTestEnv) alert(msg);
}

/**
 * TODO: Process Login Function
 * 
 * Requirements:
 * - Retrieve values from username and password input fields
 * - Construct a request body with { username, password }
 * - Configure request options for fetch (POST, JSON headers)
 * - Send request to /login endpoint
 * - Handle responses:
 *    - If 200: extract token and isAdmin from response text
 *      - Store both in sessionStorage
 *      - Redirect to recipe-page.html
 *    - If 401: alert user about incorrect login
 *    - For others: show generic alert
 * - Add try/catch to handle fetch/network errors
 * 
 * Hints:
 * - Use fetch with POST method and JSON body
 * - Use sessionStorage.setItem("key", value) to store auth token and admin flag
 * - Use `window.location.href` for redirection
 */
async function processLogin(testData) {
    try {
        let username, password;

        if (isTestEnv) {
            ({ username, password } = testData);
        } else {
            username = usernameInput?.value?.trim();
            password = passwordInput?.value?.trim();
        }
        if (!username || !password) {
            safeAlert("Username and password are required.");
            return isTestEnv ? { success: false, error: "Missing fields" } : null;
        }
        const requestBody = { username, password };

    // TODO: Retrieve username and password from input fields
    
    // - Trim input and validate that neither is empty
   

    // TODO: Create a requestBody object with username and password
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
        body: JSON.stringify(requestBody)
    };
    const response = await fetch(`${BASE_URL}/login`, requestOptions);

        // TODO: Send POST request to http://localhost:8081/login using fetch with requestOptions
        // TODO: If response status is 200
        // - Read the response as text
        // - Response will be a space-separated string: "token123 true"
        // - Split the string into token and isAdmin flag
     
        // - Store both in sessionStorage using sessionStorage.setItem()
     
        // TODO: Optionally show the logout button if applicable
        
        // TODO: Add a small delay (e.g., 500ms) using setTimeout before redirecting
        // - Use window.location.href to redirect to the recipe page
        if (response.status === 200) {
            const textResult = await response.text(); // e.g., "token123 true"
            const [token, isAdmin] = textResult.split(" ");

            if (!isTestEnv) {
                sessionStorage.setItem("auth-token", token);
                sessionStorage.setItem("is-admin", isAdmin);
            }
            if (!isTestEnv && logoutButton) {
                logoutButton.style.display = "block";
            }
            if (!isTestEnv) {
                setTimeout(() => {
                    window.location.href = "recipe-page.html";
                }, 500);
            }

            return { success: true, token, isAdmin };
        }

           
        // TODO: If response status is 401
        // - Alert the user with "Incorrect login!"

        if (response.status === 401) {
            safeAlert("Incorrect login!");
            return isTestEnv ? { success: false, error: "Unauthorized" } : null;
        }
        safeAlert("Unknown issue!");
        return isTestEnv ? { success: false, error: "Unknown" } : null;

        // TODO: For any other status code
        // - Alert the user with a generic error like "Unknown issue!"
       
    } catch (error) {
        // TODO: Handle any network or unexpected errors
        // - Log the error and alert the user
        console.error("Login error:", error);
        safeAlert("Network or server error.");
        return isTestEnv ? { success: false, error: "Exception" } : null;
    }
}

