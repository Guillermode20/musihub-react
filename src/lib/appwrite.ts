import { Client, Account, Databases, Storage, Functions, ID, AppwriteException } from 'appwrite';

// --- Configuration ---
// Retrieve Appwrite connection details from environment variables
const appwriteEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const appwriteProjectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

// Basic validation to ensure environment variables are set
if (!appwriteEndpoint || !appwriteProjectId) {
    console.error("Error: Appwrite environment variables (VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID) are not set.");
    // Consider throwing an error or implementing more robust handling
    // throw new Error("Appwrite configuration missing");
}

// --- Appwrite Client Initialization ---
const client = new Client();

client
    .setEndpoint(appwriteEndpoint!) // Use '!' assuming you've handled the check above
    .setProject(appwriteProjectId!);

// --- Export Appwrite Services ---
// Export individual services for potential direct use
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// --- Simplified Authentication Service ---
// Contains core email/password authentication methods
export const authService = {
    /**
     * Registers a new user account using email and password.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's chosen password.
     * @param {string} [name=''] - The user's name (optional).
     * @returns {Promise<Models.User<Models.Preferences>>} The newly created user account object.
     * @throws {AppwriteException} If registration fails (e.g., email already exists, weak password).
     */
    async register(email: string, password: string, name = '') {
        try {
            // ID.unique() generates a unique ID for the user, required by Appwrite
            const userId = ID.unique();
            console.log('Generated userId:', userId);
            const userAccount = await account.create(userId, email, password, name);
            console.log('Registration successful:', userAccount);
            // You might want to automatically log the user in after successful registration:
            // await this.login(email, password);
            return userAccount;
        } catch (error) {
            console.error('Appwrite service :: register :: error', error);
            // Re-throw the error to be handled by the calling UI component
            throw error;
        }
    },

    /**
     * Logs in a user with their email and password. Creates a session.
     * @param {string} email - The user's registered email address.
     * @param {string} password - The user's password.
     * @returns {Promise<Models.Session>} The session object upon successful login.
     * @throws {AppwriteException} If login fails (e.g., invalid credentials, user not found).
     */
    async login(email: string, password: string) {
        try {
            console.log('Attempting login with email:', email);
            console.log('Type of email:', typeof email);
            // Creates an email/password session
            const session = await account.createEmailPasswordSession(email, password);
            console.log('Login successful:', session);
            return session;
        } catch (error) {
            console.error('Appwrite service :: login :: error', error);
            if (error instanceof AppwriteException) {
                console.error('AppwriteException details:', {
                    message: error.message,
                    code: error.code,
                    type: error.type,
                    response: error.response,
                });
            }
            throw error; // Re-throw for UI handling
        }
    },

    /**
     * Checks if a user is currently logged in by attempting to retrieve account details.
     * This is the standard way to verify an active session.
     * @returns {Promise<Models.User<Models.Preferences> | null>} The user account object if logged in, otherwise null.
     */
    async getCurrentUser() {
        try {
            // account.get() fetches the details of the user associated with the current session
            const userAccount = await account.get();
            return userAccount; // User is logged in
        } catch (error) {
            // Appwrite throws an exception (often 401 Unauthorized) if no active session exists
            if (error instanceof AppwriteException && error.code === 401) {
                 // This is expected if the user is not logged in, not necessarily an error condition
                console.log('No active user session found.');
            } else {
                // Log other unexpected errors
                console.error('Appwrite service :: getCurrentUser :: error', error);
            }
            return null; // Indicate that no user is currently authenticated
        }
    },

    /**
     * Logs out the currently authenticated user by deleting their current session.
     * @returns {Promise<void>} Resolves when logout is complete.
     * @throws {AppwriteException} If logout fails (e.g., no active session to delete).
     */
    async logout() {
        try {
            // 'current' targets the session associated with the current client request
            await account.deleteSession('current');
            console.log('Logout successful');
        } catch (error) {
            console.error('Appwrite service :: logout :: error', error);
            throw error; // Re-throw for UI handling if needed
        }
    }
};

// --- Default Export ---
// Export the configured client instance as default (though often you'll import specific services)
export default client;