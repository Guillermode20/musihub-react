import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Avatar } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Table } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { authService } from "../lib/appwrite";
import {
    SidebarProvider,
    Sidebar,
    SidebarInset,
    SidebarTrigger,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "../components/ui/sidebar";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "../components/ui/dropdown-menu";


/**
 * Dashboard page component.
 * 
 * Displays authenticated user's profile info, dashboard cards, and recent activity table.
 * Redirects to login if no active session. Provides logout functionality.
 * Shows loading state while fetching user data.
 *
 * @returns {JSX.Element} The dashboard UI.
 */
export default function Dashboard() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await authService.getCurrentUser();
                if (!currentUser) {
                    navigate("/login");
                } else {
                    setUser(currentUser);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <h2 className="font-semibold text-lg px-3 py-2">Menu</h2>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton>Dashboard</SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton>Profile</SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton>Settings</SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
                <div className="flex-1" />
                <div className="p-3 border-t border-border">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors">
                                <Avatar className="w-8 h-8">
                                    <img
                                        src={user.prefs?.avatarUrl || "https://via.placeholder.com/40"}
                                        alt="User Avatar"
                                        className="rounded-full"
                                    />
                                </Avatar>
                                <span className="font-medium text-sm">{user.name || "User"}</span>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="top" align="start">
                            <DropdownMenuItem onSelect={handleLogout}>
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </Sidebar>
            <SidebarInset className="min-h-screen p-8 space-y-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <SidebarTrigger />
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                    </div>
                    <Button onClick={handleLogout}>Logout</Button>
                </div>

                <div className="flex items-center space-x-4">
                    <Avatar>
                        <img
                            src={user.prefs?.avatarUrl || "https://via.placeholder.com/40"}
                            alt="User Avatar"
                            className="rounded-full"
                        />
                    </Avatar>
                    <div>
                        <p className="font-semibold">{user.name || "Unnamed User"}</p>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                    <Badge className="ml-4">Active</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader>
                            <h2 className="font-semibold">Card 1</h2>
                        </CardHeader>
                        <CardContent>
                            <p>This is some content inside card 1.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <h2 className="font-semibold">Card 2</h2>
                        </CardHeader>
                        <CardContent>
                            <p>This is some content inside card 2.</p>
                        </CardContent>
                        <Card>
                            <CardHeader>
                                <h2 className="font-semibold">User Info</h2>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p><strong>User ID:</strong> {user.$id}</p>
                                <p><strong>Status:</strong> {user.status}</p>
                                <p><strong>Registered:</strong> {new Date(user.registration * 1000).toLocaleString()}</p>
                                <p><strong>Email Verified:</strong> {user.emailVerification ? 'Yes' : 'No'}</p>
                            </CardContent>
                        </Card>
                    </Card>
                    <Card>
                        <CardHeader>
                            <h2 className="font-semibold">Card 3</h2>
                        </CardHeader>
                        <CardContent>
                            <p>This is some content inside card 3.</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
                    <Table>
                        <thead>
                            <tr>
                                <th className="text-left p-2">Date</th>
                                <th className="text-left p-2">Activity</th>
                                <th className="text-left p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-2">2025-04-01</td>
                                <td className="p-2">Logged in</td>
                                <td className="p-2"><Badge>Success</Badge></td>
                            </tr>
                            <tr>
                                <td className="p-2">2025-04-02</td>
                                <td className="p-2">Updated profile</td>
                                <td className="p-2"><Badge>Success</Badge></td>
                            </tr>
                            <tr>
                                <td className="p-2">2025-04-03</td>
                                <td className="p-2">Password change</td>
                                <td className="p-2"><Badge>Pending</Badge></td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
