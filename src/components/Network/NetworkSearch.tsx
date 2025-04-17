import { Input } from "../ui/input";
import useDebounce from "../../hooks/useDebounce";
import { pocketbaseService } from "../../lib/pocketbase";
import { useState, useEffect } from "react";
import { ProfileCard } from "./ProfileCard";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Search, UserPlus, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";

export function NetworkSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [profile, setProfile] = useState<any>(null);
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (term: string) => {
        if (term) {
            setIsSearching(true);
            try {
                const profile = await pocketbaseService.getProfilebyName(term);
                setProfile(profile);
            } catch (error) {
                console.error("Error searching profiles:", error);
            } finally {
                setIsSearching(false);
            }
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
        <div className="space-y-8">
            {/* Search Section */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Find Music Creatives</h2>
                    <p className="text-muted-foreground mt-2">Connect with fellow musicians, producers, and industry professionals</p>
                </div>

                <div className="relative max-w-2xl">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by name, skills, or location..."
                        className="pl-10 w-full h-12 bg-background text-foreground border border-border rounded-md shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Separator className="my-8 bg-border" />

            {/* Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Search Results */}
                <Card className="border border-border bg-card rounded-lg shadow-sm">
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <UserPlus className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-foreground">Search Results</CardTitle>
                        </div>
                        <CardDescription className="text-muted-foreground pt-1">Find and connect with other musicians</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="min-h-[400px] bg-background rounded-md border border-border p-1">
                            {isSearching ? (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-muted-foreground">Searching...</p>
                                </div>
                            ) : profile ? (
                                <div className="p-6">
                                    <ProfileCard profile={profile} />
                                    <div className="mt-6 flex justify-end">
                                        <Button
                                            onClick={() => handleConnect(profile.id)}
                                            className="w-full sm:w-auto transition-transform transform hover:scale-105 focus:scale-105"
                                        >
                                            <UserPlus className="h-4 w-4 mr-2" />
                                            Connect
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                                    <Search className="h-12 w-12 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground font-medium">Search for musicians to connect with</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Try searching by name, instrument, or location
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Pending Requests */}
                <Card className="border border-border bg-card rounded-lg shadow-sm">
                    <CardHeader>
                        <div className="flex items-center space-x-3">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <CardTitle className="text-foreground">Pending Requests</CardTitle>
                        </div>
                        <CardDescription className="text-muted-foreground pt-1">Manage your connection requests</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="bg-background rounded-md border border-border">
                            <ScrollArea className="h-[400px]">
                                <div className="p-6">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center h-[300px]">
                                            <p className="text-muted-foreground">Loading...</p>
                                        </div>
                                    ) : pendingRequests.length > 0 ? (
                                        <div className="space-y-6">
                                            {pendingRequests.map((request, index) => {
                                                if (!request.otherProfile) return null;

                                                return (
                                                    <div key={request.id}>
                                                        <div className="space-y-4">
                                                            <ProfileCard profile={request.otherProfile} />
                                                            <div className="flex justify-end gap-3">
                                                                {request.isSender ? (
                                                                    <p className="text-sm text-muted-foreground italic py-2">
                                                                        Request Sent
                                                                    </p>
                                                                ) : (
                                                                    <>
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="border-border text-foreground hover:bg-muted transition-transform transform hover:scale-105 focus:scale-105"
                                                                            onClick={() => handleRejectRequest(request.id)}
                                                                        >
                                                                            Decline
                                                                        </Button>
                                                                        <Button
                                                                            size="sm"
                                                                            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-transform transform hover:scale-105 focus:scale-105"
                                                                            onClick={() => handleAcceptRequest(request.id)}
                                                                        >
                                                                            Accept
                                                                        </Button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {index < pendingRequests.length - 1 && (
                                                            <Separator className="my-6 bg-border" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-[300px] text-center">
                                            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                                            <p className="text-muted-foreground font-medium">No pending connection requests</p>
                                            <p className="text-sm text-muted-foreground mt-2">
                                                When you send or receive connection requests, they'll appear here
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}