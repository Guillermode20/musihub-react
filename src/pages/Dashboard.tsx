import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../components/ui/avatar";
import { DashboardContent } from "../components/Dashboard/DashboardContent";
import {
    SidebarProvider,
    Sidebar,
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

import { getCurrentUser, logout, type User, onAuthStateChange } from "../lib/pocketbase";

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(getCurrentUser());
    const [currentView, setCurrentView] = useState<'dashboard' | 'network'>('dashboard');

    useEffect(() => {
        // Check if user is authenticated, if not redirect to login
        if (!user) {
            navigate('/login');
            return;
        }

        // Listen for auth state changes
        const unsubscribe = onAuthStateChange((isLoggedIn) => {
            if (!isLoggedIn) {
                setUser(null);
                navigate('/login');
            } else {
                setUser(getCurrentUser());
            }
        });

        return () => {
            unsubscribe();
        };
    }, [navigate, user]);

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (!user) {
        return null; // Don't render anything while checking auth state
    }

    return (
        <SidebarProvider>
            <div className="flex w-full h-screen">
                <Sidebar>
                    <SidebarHeader>
                        <h2 className="font-semibold text-xl px-3 py-2">MusiHub</h2>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={currentView === 'dashboard'}
                                    onClick={() => setCurrentView('dashboard')}
                                >
                                    Dashboard
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    isActive={currentView === 'network'}
                                    onClick={() => setCurrentView('network')}
                                >
                                    Network
                                </SidebarMenuButton>
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
                    <div className="p-4 border-t border-border bg-muted/10">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors">
                                    <Avatar className="w-9 h-9 border-2 border-primary">
                                        <img
                                            src={user.avatar || "https://via.placeholder.com/40"}
                                            alt="User Avatar"
                                            className="rounded-full"
                                        />
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">{user.name}</span>
                                        <span className="text-xs text-muted-foreground">{user.email}</span>
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" align="start" className="w-48">
                                <DropdownMenuItem onSelect={handleLogout}>
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </Sidebar>
                <DashboardContent user={user} onLogout={handleLogout} currentView={currentView} />
            </div>
        </SidebarProvider>
    );
}
