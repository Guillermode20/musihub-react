import { useState } from "react";
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

export default function Dashboard() {
    const [user] = useState<any>({
        name: "User",
        email: "user@example.com",
        prefs: { avatarUrl: "" }
    });
    const [] = useState(false);
    const [currentView, setCurrentView] = useState<'dashboard' | 'network'>('dashboard');


    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };


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
                                            src={user.prefs?.avatarUrl || "https://via.placeholder.com/40"}
                                            alt="User Avatar"
                                            className="rounded-full"
                                        />
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm">{user.name || "User"}</span>
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
        </SidebarProvider >
    );
}

function logout() {
    throw new Error("Function not implemented.");
}
