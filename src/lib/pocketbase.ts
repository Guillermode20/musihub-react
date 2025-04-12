import PocketBase, { type RecordModel } from 'pocketbase';

// Base URL configuration
const POCKETBASE_URL = 'http://localhost:8090';

// User type based on PocketBase auth response
export interface User extends RecordModel {
    email: string;
    name: string;
    avatar?: string;
}

// API Service class that encapsulates all PocketBase operations
class PocketBaseService {
    private static instance: PocketBaseService;
    private client: PocketBase;

    private constructor() {
        this.client = new PocketBase(POCKETBASE_URL);
    }

    public static getInstance(): PocketBaseService {
        if (!PocketBaseService.instance) {
            PocketBaseService.instance = new PocketBaseService();
        }
        return PocketBaseService.instance;
    }

    // Auth functions
    public async register(name: string, email: string, password: string, passwordConfirm: string) {
        const data = await this.client.collection('users').create({
            email,
            password,
            passwordConfirm,
            name,
        });
        
        await this.login(email, password);
        return data;
    }

    public async login(email: string, password: string) {
        return await this.client.collection('users').authWithPassword(email, password);
    }

    public async logout() {
        this.client.authStore.clear();
    }

    public getCurrentUser(): User | null {
        return this.client.authStore.model as User | null;
    }

    public isLoggedIn(): boolean {
        return this.client.authStore.isValid;
    }

    public onAuthStateChange(callback: (isLoggedIn: boolean) => void) {
        return this.client.authStore.onChange((token) => {
            callback(!!token);
        });
    }

    public async getProfilebyName(name: string) {
        const profile = await this.client.collection('profiles').getFirstListItem(`name~"${name}"`);
        return profile;
    }
}

// Export a singleton instance of the service
export const pocketbaseService = PocketBaseService.getInstance();
