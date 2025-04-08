import PocketBase, { type RecordModel } from 'pocketbase';

// Create PocketBase instance
export const pb = new PocketBase('http://localhost:8090');

// User type based on PocketBase auth response
export interface User extends RecordModel {
    email: string;
    name: string;
    avatar?: string;
}

// Auth functions
export async function register(name: string, email: string, password: string, passwordConfirm: string) {
    const data = await pb.collection('users').create({
        email,
        password,
        passwordConfirm,
        name,
    });
    
    await login(email, password);
    return data;
}

export async function login(email: string, password: string) {
    return await pb.collection('users').authWithPassword(email, password);
}

export async function logout() {
    pb.authStore.clear();
}

// Get current user data
export function getCurrentUser() {
    return pb.authStore.model as User | null;
}

// Check if user is authenticated
export function isLoggedIn() {
    return pb.authStore.isValid;
}

// Listen to auth state changes
export function onAuthStateChange(callback: (isLoggedIn: boolean) => void) {
    return pb.authStore.onChange((token) => {
        callback(!!token);
    });
}