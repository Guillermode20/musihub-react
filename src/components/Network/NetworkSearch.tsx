import { Input } from "../ui/input";
import useDebounce from "../../hooks/useDebounce";
import { pocketbaseService } from "../../lib/pocketbase";
import { useState, useEffect } from "react";
import { ProfileCard } from "./ProfileCard";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

export function NetworkSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [profile, setProfile] = useState<any>(null);
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleSearch = async (term: string) => {
        if (term) {
            const profile = await pocketbaseService.getProfilebyName(term);
            console.log("Search Results:", profile);
            setProfile(profile);
        }
    };

    const loadCurrentUserProfile = async () => {
        const currentUser = pocketbaseService.authStore.model;
        if (!currentUser) {
            setIsLoading(false);
            return;
        }

        try {
            const profile = await pocketbaseService.client.collection('profiles').getFirstListItem(`userId="${currentUser.id}"`);
            setCurrentUserProfile(profile);
        } catch (error) {
            console.error("Error loading current user profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConnect = async (targetProfileId: string) => {
        try {
            if (!currentUserProfile) {
                console.error("User profile not loaded");
                return;
            }

            await pocketbaseService.createConnectionRequest(
                currentUserProfile.id,
                targetProfileId
            );
            // Refresh pending requests after sending a new one
            await loadPendingRequests();
        } catch (error) {
            console.error("Error sending connection request:", error);
        }
    };

    const loadPendingRequests = async () => {
        try {
            if (!currentUserProfile) return;
            const requests = await pocketbaseService.getPendingConnectionRequests(currentUserProfile.id);
            setPendingRequests(requests.items);
        } catch (error) {
            console.error("Error loading pending requests:", error);
        }
    };

    const handleAcceptRequest = async (requestId: string) => {
        try {
            await pocketbaseService.acceptConnectionRequest(requestId);
            await loadPendingRequests();
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    const handleRejectRequest = async (requestId: string) => {
        try {
            await pocketbaseService.rejectConnectionRequest(requestId);
            await loadPendingRequests();
        } catch (error) {
            console.error("Error rejecting request:", error);
        }
    };

    useEffect(() => {
        if (debouncedSearchTerm) {
            handleSearch(debouncedSearchTerm);
        } else {
            setProfile(null);
        }
    }, [debouncedSearchTerm]);

    useEffect(() => {
        loadCurrentUserProfile();
    }, []);

    useEffect(() => {
        if (currentUserProfile) {
            loadPendingRequests();
        }
    }, [currentUserProfile]);

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Find Music Creatives</h2>
                <p className="text-muted-foreground">Connect with fellow musicians, producers, and industry professionals</p>
            </div>

            <div className="flex gap-4">
                <Input
                    type="search"
                    placeholder="Search by name, skills, or location..."
                    className="flex-1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Search Results */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Search Results</h3>
                    <div className="py-4 text-center text-muted-foreground">
                        {profile ? (
                            <div className="space-y-4">
                                <ProfileCard profile={profile} />
                                <Button
                                    onClick={() => handleConnect(profile.id)}
                                    className="mt-4"
                                >
                                    Connect
                                </Button>
                            </div>
                        ) : (
                            <p>Search for musicians to connect with</p>
                        )}
                    </div>
                </div>

                {/* Pending Requests */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Pending Requests</h3>
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-muted-foreground">Loading...</p>
                            </div>
                        ) : pendingRequests.length > 0 ? (
                            <div className="space-y-4">
                                {pendingRequests.map((request) => {
                                    // Log the raw request and expand object to see what's coming from PocketBase
                                    console.log('Processing Request:', request.id, 'Expand:', request.expand);

                                    // Use the otherProfile and isSender flags from the processed request object
                                    // returned by getPendingConnectionRequests

                                    // Optional: Add a check in case profile data is unexpectedly missing
                                    if (!request.otherProfile) {
                                        console.warn("Other profile data missing for request:", request.id);
                                        return null; // Don't render if data is incomplete
                                    }

                                    return (
                                        <div key={request.id} className="border rounded-lg p-4 space-y-4">
                                            <ProfileCard profile={request.otherProfile} />
                                            <div className="flex gap-2 justify-end items-center">
                                                {request.isSender ? (
                                                    <span className="text-sm text-muted-foreground italic">Request Sent</span>
                                                ) : (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleRejectRequest(request.id)}
                                                        >
                                                            Reject
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleAcceptRequest(request.id)}
                                                        >
                                                            Accept
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                <p>No pending connection requests</p>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}