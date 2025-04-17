import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/card";
import { NetworkSearch, NetworkMessages, NetworkForum } from ".";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { pocketbaseService } from "../../lib/pocketbase";

export function Network() {
    const [connections, setConnections] = useState<any[]>([]);
    const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
    const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);

    useEffect(() => {
        const loadCurrentUserProfile = async () => {
            const currentUser = pocketbaseService.authStore.model;
            if (!currentUser) return;

            try {
                const profile = await pocketbaseService.client.collection('profiles').getFirstListItem(`userId="${currentUser.id}"`);
                setCurrentUserProfile(profile);
                await loadPendingRequests(profile.id);
                // TODO: Load accepted connections here when implemented
            } catch (error) {
                console.error("Error loading profile data:", error);
            }
        };

        loadCurrentUserProfile();
    }, []);

    const loadPendingRequests = async (profileId: string) => {
        try {
            const requests = await pocketbaseService.getPendingConnectionRequests(profileId);
            // Filter to only show incoming requests (where current user is not the sender)
            setIncomingRequests(requests.items.filter((req: any) => !req.isSender));
        } catch (error) {
            console.error("Error loading pending requests:", error);
        }
    };

    const handleAcceptRequest = async (requestId: string) => {
        try {
            await pocketbaseService.acceptConnectionRequest(requestId);
            if (currentUserProfile) {
                await loadPendingRequests(currentUserProfile.id);
            }
        } catch (error) {
            console.error("Error accepting request:", error);
        }
    };

    const handleRejectRequest = async (requestId: string) => {
        try {
            await pocketbaseService.rejectConnectionRequest(requestId);
            if (currentUserProfile) {
                await loadPendingRequests(currentUserProfile.id);
            }
        } catch (error) {
            console.error("Error rejecting request:", error);
        }
    };

    return (
        <div className="grid grid-cols-[350px_1fr] gap-6">
            {/* Left Column - Connections */}
            <div className="space-y-6">
                {/* Your Connections Section */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Your Connections</h2>
                    <ScrollArea className="h-[300px]">
                        <div className="space-y-4">
                            {connections.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">
                                    No connections yet. Start connecting with other creatives!
                                </p>
                            ) : (
                                connections.map((connection) => (
                                    <div key={connection.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <p className="font-medium">{connection.name}</p>
                                            <p className="text-sm text-muted-foreground">{connection.location}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </Card>

                {/* Incoming Requests Section */}
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Incoming Requests</h2>
                    <ScrollArea className="h-[300px]">
                        <div className="space-y-4">
                            {incomingRequests.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">
                                    No pending requests
                                </p>
                            ) : (
                                incomingRequests.map((request) => (
                                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div>
                                            <p className="font-medium">{request.otherProfile?.name}</p>
                                            <p className="text-sm text-muted-foreground">{request.otherProfile?.location}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleAcceptRequest(request.id)}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleRejectRequest(request.id)}
                                                className="text-red-600 border-red-600 hover:bg-red-100"
                                            >
                                                Deny
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </Card>
            </div>

            {/* Right Column - Tabbed Panel */}
            <Card className="p-6">
                <Tabs defaultValue="search" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="search">Find Creatives</TabsTrigger>
                        <TabsTrigger value="messages">Messages</TabsTrigger>
                        <TabsTrigger value="forum">Forum</TabsTrigger>
                    </TabsList>

                    <TabsContent value="search">
                        <NetworkSearch />
                    </TabsContent>

                    <TabsContent value="messages">
                        <NetworkMessages />
                    </TabsContent>

                    <TabsContent value="forum">
                        <NetworkForum />
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    );
}