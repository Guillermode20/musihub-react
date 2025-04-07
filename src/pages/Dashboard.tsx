import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card"; // Added CardTitle, CardDescription
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"; // Explicit imports
import { Badge } from "../components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table"; // Added Table components
// Removed Button import as it's no longer used in the top bar
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
import { User } from "appwrite"; // Import User type for better type safety if available

// Define a more specific User type if possible, based on Appwrite's User model
interface AppwriteUser extends User {
    prefs?: {
        avatarUrl?: string;
        location?: string;
        instrument?: string;
        genre?: string;
        // Add other potential prefs
    };
    // Add other fields returned by getCurrentUser if needed
    registration: number; // Assuming registration is Unix timestamp (seconds)
}


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
    // Use a more specific type if AppwriteUser is defined
    const [user, setUser] = useState<AppwriteUser | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true); // Ensure loading is true at the start
            try {
                // Cast the result to your specific user type if defined
                const currentUser = await authService.getCurrentUser() as AppwriteUser | null;
                if (!currentUser) {
                    navigate("/login");
                } else {
                    // Mock some prefs data if not present for demo purposes
                    if (!currentUser.prefs) {
                        currentUser.prefs = {};
                    }
                    if (!currentUser.prefs?.location) {
                        currentUser.prefs.location = "Manchester, UK";
                    }
                    if (!currentUser.prefs?.instrument) {
                        currentUser.prefs.instrument = "Guitarist";
                    }
                    if (!currentUser.prefs?.genre) {
                        currentUser.prefs.genre = "Indie Rock";
                    }
                    if (!currentUser.name) {
                        currentUser.name = "Alex Turner (Mock)"; // Mock name
                    }
                    if (!currentUser.email) {
                        currentUser.email = "alex.t@arcticmonkeys.mock"; // Mock email
                    }
                    if (!currentUser.prefs.avatarUrl) {
                        // Use a generic avatar or a themed placeholder
                        currentUser.prefs.avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name || 'User'}`;
                    }

                    setUser(currentUser);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                // Consider showing an error message to the user
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
            // Optionally show a notification to the user
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
                <p>Loading Dashboard...</p> {/* Slightly more informative text */}
            </div>
        );
    }

    // If loading is finished but user is still null (e.g., redirect hasn't happened yet)
    if (!user) {
        // This prevents rendering errors before navigate completes
        return null;
    }

    // --- Mock Data ---
    const mockStats = {
        profileViews: 142,
        newConnections: 7,
        unreadMessages: 3,
    };

    const mockRecentActivity = [
        { id: 1, date: "2024-05-14", activity: "Connected with Sarah Jones (Drummer)", status: "Completed", type: "connection" },
        { id: 2, date: "2024-05-13", activity: "Replied to message from 'The Deaf Institute'", status: "Sent", type: "message" },
        { id: 3, date: "2024-05-12", activity: "Added new gig: 'Band on the Wall, Manchester'", status: "Published", type: "gig" },
        { id: 4, date: "2024-05-11", activity: "Updated profile: Added 'Songwriting' skill", status: "Completed", type: "profile" },
        { id: 5, date: "2024-05-10", activity: "Applied to join project: 'Northern Soul Revival'", status: "Pending", type: "project" },
    ];
    // --- End Mock Data ---


    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .slice(0, 2)
            .join('');
    };


    return (
        <SidebarProvider>
            {/* --- Sidebar --- */}
            <Sidebar>
                <SidebarHeader>
                    <h2 className="font-semibold text-lg px-3 py-2">Musician Hub</h2>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        {/* Use more relevant menu items */}
                        <SidebarMenuItem>
                            <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton>My Profile</SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton>Gigs & Opportunities</SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton>Connections</SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton>Messages</SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton>Settings</SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
                <div className="flex-1" /> {/* Pushes dropdown to bottom */}
                <div className="p-3 border-t border-border">
                    {/* User dropdown remains the primary way to logout */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={user.prefs?.avatarUrl} alt={user.name || "User Avatar"} />
                                    <AvatarFallback>{getInitials(user.name || "User")}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm truncate">{user.name || "User"}</span>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="top" align="start">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Account Settings</DropdownMenuItem>
                            <DropdownMenuItem onSelect={handleLogout}>
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </Sidebar>

            {/* --- Main Content Area --- */}
            <SidebarInset className="min-h-screen bg-muted/40 p-4 md:p-8"> {/* Added background color */}
                {/* Top Bar */}
                <div className="flex justify-between items-center mb-8"> {/* Increased bottom margin */}
                    <div className="flex items-center space-x-3">
                        <SidebarTrigger />
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
                    </div>
                    {/* Removed redundant Logout Button here */}
                </div>

                {/* User Info Card */}
                <Card className="mb-8"> {/* Wrapped in Card, added bottom margin */}
                    <CardHeader>
                        <CardTitle className="text-xl">Welcome back, {user.name || "Musician"}!</CardTitle>
                        <CardDescription>
                            Here's what's happening on your network.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center space-x-4">
                        <Avatar className="h-16 w-16"> {/* Larger Avatar */}
                            <AvatarImage src={user.prefs?.avatarUrl} alt={user.name || "User Avatar"} />
                            <AvatarFallback>{getInitials(user.name || "U")}</AvatarFallback>
                        </Avatar>
                        <div className="flex-grow">
                            <p className="font-semibold text-lg">{user.name || "Unnamed User"}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-sm text-muted-foreground">{user.prefs?.instrument || ""} - {user.prefs?.location || ""}</p>
                            {/* Displaying more user details from mock prefs */}
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                            <Badge variant={user.emailVerification ? "default" : "secondary"}>
                                {user.emailVerification ? 'Verified' : 'Email Unverified'}
                            </Badge>
                            <Badge variant="outline">
                                Status: {user.status ? 'Active' : 'Inactive'}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                                Joined: {new Date(user.registration * 1000).toLocaleDateString()}
                            </p>
                        </div>
                    </CardContent>
                </Card>


                {/* Dashboard Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"> {/* Increased gap, added bottom margin */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Views</CardTitle>
                            <CardDescription>Past 30 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{mockStats.profileViews}</p>
                            <p className="text-xs text-muted-foreground">+15% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>New Connections</CardTitle>
                            <CardDescription>Awaiting your acceptance</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{mockStats.newConnections}</p>
                            <p className="text-xs text-muted-foreground">View Requests</p> {/* Make this a link later */}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming Gigs</CardTitle>
                            <CardDescription>Your scheduled performances</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* <p className="text-2xl font-bold">2</p> */}
                            <p className="font-medium">The Leadmill, Sheffield</p>
                            <p className="text-xs text-muted-foreground">May 25, 2024</p>
                            {/* Could list more or link to a Gigs page */}
                        </CardContent>
                    </Card>
                    {/* Removed the nested User Info card - info is now displayed above */}
                </div>

                {/* Recent Activity Table */}
                <Card> {/* Wrapped table in a Card */}
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your latest actions and notifications.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[120px]">Date</TableHead>
                                    <TableHead>Activity</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockRecentActivity.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.date}</TableCell>
                                        <TableCell>{item.activity}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant={
                                                item.status === 'Completed' || item.status === 'Published' || item.status === 'Sent' ? 'default' :
                                                    item.status === 'Pending' ? 'secondary' :
                                                        'outline' // Default variant
                                            }>
                                                {item.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </SidebarInset>
        </SidebarProvider>
    );
}