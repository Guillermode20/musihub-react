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
    private _client: PocketBase;

    private constructor() {
        this._client = new PocketBase(POCKETBASE_URL);
    }

    public static getInstance(): PocketBaseService {
        if (!PocketBaseService.instance) {
            PocketBaseService.instance = new PocketBaseService();
        }
        return PocketBaseService.instance;
    }

    // Auth functions
    // Getter for the PocketBase client
    public get client(): PocketBase {
        return this._client;
    }

    public async register(name: string, email: string, password: string, passwordConfirm: string) {
        const data = await this._client.collection('users').create({
            email,
            password,
            passwordConfirm,
            name,
        });
        
        await this.login(email, password);
        return data;
    }

    public async login(email: string, password: string) {
        return await this._client.collection('users').authWithPassword(email, password);
    }

    public async logout() {
        this._client.authStore.clear();
    }

    public getCurrentUser(): User | null {
        return this._client.authStore.model as User | null;
    }

    public isLoggedIn(): boolean {
        return this._client.authStore.isValid;
    }

    public onAuthStateChange(callback: (isLoggedIn: boolean) => void) {
        return this._client.authStore.onChange((token) => {
            callback(!!token);
        });
    }

    public async getProfilebyName(name: string) {
        const profile = await this._client.collection('profiles').getFirstListItem(`name~"${name}"`);
        return profile;
    }
    
    public async getUserProfile(userId: string) {
        try {
            const profile = await this._client.collection('profiles').getFirstListItem(`user="${userId}"`);
            return profile;
        } catch (error) {
            console.error("Error fetching user profile:", error);
            throw error;
        }
    }

    async hasExistingConnectionRequest(profileId1: string, profileId2: string): Promise<boolean> {
        try {
            if (!profileId1 || !profileId2) {
                throw new Error("Both profile IDs are required");
            }
            
            const existingRequests = await this._client.collection('profile_connections').getList(1, 1, {
                filter: `(profile_id_1="${profileId1}" && profile_id_2="${profileId2}") || (profile_id_1="${profileId2}" && profile_id_2="${profileId1}")`
            });
            return existingRequests.totalItems > 0;
        } catch (error) {
            console.error("Error checking existing connection request:", error);
            throw error;
        }
    }

    async createConnectionRequest(profileId1: string, profileId2: string) {
        try {
            if (!profileId1 || !profileId2) {
                throw new Error("Both profile IDs are required");
            }
            
            if (profileId1 === profileId2) {
                throw new Error("Cannot create a connection request with yourself");
            }
            
            // Check for existing connection request
            const hasExisting = await this.hasExistingConnectionRequest(profileId1, profileId2);
            if (hasExisting) {
                throw new Error("A connection request already exists between these profiles");
            }

            const data = {
                profile_id_1: profileId1,
                profile_id_2: profileId2,
                status: "pending" // Initial status for connection requests
            };
            
            const record = await this._client.collection('profile_connections').create(data);
            return record;
        } catch (error) {
            console.error("Error creating connection request:", error);
            throw error;
        }
    }

    async getPendingConnectionRequests(profileId: string) {
        try {
            if (!profileId) {
                throw new Error("Profile ID is required");
            }
            
            // Get all connection requests where the profile is either sender or receiver
            // and the status is 'pending'
            const pendingRequests = await this._client.collection('profile_connections').getList(1, 50, {
                filter: `(profile_id_1="${profileId}" || profile_id_2="${profileId}") && status="pending"`,
                sort: '-created', // Sort by creation date, newest first
                expand: 'profile_id_1,profile_id_2' // Expand profile information
            });
            
            // Process the expanded records to make them easier to work with
            const processedRequests = pendingRequests.items.map(request => {
                const expanded = request.expand as any;
                return {
                    ...request,
                    // Determine if this profile is the sender or receiver
                    isSender: request.profile_id_1 === profileId,
                    // Get the other profile's data
                    otherProfile: request.profile_id_1 === profileId ? 
                        expanded?.profile_id_2 : expanded?.profile_id_1
                };
            });
            
            return {
                ...pendingRequests,
                items: processedRequests
            };
        } catch (error) {
            console.error("Error fetching pending connection requests:", error);
            throw error;
        }
    }

    async getAcceptedConnections(profileId: string) {
        try {
            if (!profileId) {
                throw new Error("Profile ID is required");
            }
            
            // Get all connection requests where the profile is either sender or receiver
            // and the status is 'accepted'
            const acceptedConnections = await this._client.collection('profile_connections').getList(1, 100, {
                filter: `(profile_id_1="${profileId}" || profile_id_2="${profileId}") && status="accepted"`,
                sort: '-updated', // Sort by update date, newest first
                expand: 'profile_id_1,profile_id_2' // Expand profile information
            });
            
            // Process the expanded records to make them easier to work with
            const processedConnections = acceptedConnections.items.map(connection => {
                const expanded = connection.expand as any;
                return {
                    ...connection,
                    // Get the other profile's data
                    connectedProfile: connection.profile_id_1 === profileId ? 
                        expanded?.profile_id_2 : expanded?.profile_id_1
                };
            });
            
            return {
                ...acceptedConnections,
                items: processedConnections
            };
        } catch (error) {
            console.error("Error fetching accepted connections:", error);
            throw error;
        }
    }

    async acceptConnectionRequest(requestId: string) {
        try {
            if (!requestId) {
                throw new Error("Request ID is required");
            }
            
            // First verify the request exists and is in pending state
            const request = await this._client.collection('profile_connections').getOne(requestId);
            
            if (request.status !== 'pending') {
                throw new Error(`Cannot accept a request with status: ${request.status}`);
            }
            
            const record = await this._client.collection('profile_connections').update(requestId, {
                status: 'accepted'
            });
            return record;
        } catch (error) {
            console.error("Error accepting connection request:", error);
            throw error;
        }
    }

    async rejectConnectionRequest(requestId: string) {
        try {
            if (!requestId) {
                throw new Error("Request ID is required");
            }
            
            // First verify the request exists and is in pending state
            const request = await this._client.collection('profile_connections').getOne(requestId);
            
            if (request.status !== 'pending') {
                throw new Error(`Cannot reject a request with status: ${request.status}`);
            }
            
            const record = await this._client.collection('profile_connections').update(requestId, {
                status: 'rejected'
            });
            return record;
        } catch (error) {
            console.error("Error rejecting connection request:", error);
            throw error;
        }
    }

    async cancelConnectionRequest(requestId: string) {
        try {
            if (!requestId) {
                throw new Error("Request ID is required");
            }
            
            // First verify the request exists and is in pending state
            const request = await this._client.collection('profile_connections').getOne(requestId);
            
            if (request.status !== 'pending') {
                throw new Error(`Cannot cancel a request with status: ${request.status}`);
            }
            
            // Delete the connection request
            await this._client.collection('profile_connections').delete(requestId);
            return true;
        } catch (error) {
            console.error("Error canceling connection request:", error);
            throw error;
        }
    }

    async getConnectionStatus(profileId1: string, profileId2: string) {
        try {
            if (!profileId1 || !profileId2) {
                throw new Error("Both profile IDs are required");
            }
            
            const connections = await this._client.collection('profile_connections').getList(1, 1, {
                filter: `(profile_id_1="${profileId1}" && profile_id_2="${profileId2}") || (profile_id_1="${profileId2}" && profile_id_2="${profileId1}")`
            });
            
            if (connections.totalItems === 0) {
                return { exists: false, status: null, record: null };
            }
            
            return { 
                exists: true, 
                status: connections.items[0].status,
                record: connections.items[0]
            };
        } catch (error) {
            console.error("Error checking connection status:", error);
            throw error;
        }
    }

    public get authStore() {
        return this._client.authStore;
    }
}

// Export a singleton instance of the service
export const pocketbaseService = PocketBaseService.getInstance();
