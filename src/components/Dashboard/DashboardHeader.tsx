import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";

interface DashboardHeaderProps {
    user: any;
    onLogout: () => Promise<void>;
    currentView: 'dashboard' | 'network';
}

export function DashboardHeader({ user, onLogout, currentView }: DashboardHeaderProps) {
    return (
        <div className="flex justify-between items-center pb-6 border-b">
            <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div>
                    <h1 className="text-3xl font-bold">
                        {currentView === 'dashboard' ? 'Dashboard' : 'Network'}
                    </h1>
                    {currentView === 'dashboard' && (
                        <p className="text-muted-foreground mt-1">Welcome back, {user.name || "User"}!</p>
                    )}
                    {currentView === 'network' && (
                        <p className="text-muted-foreground mt-1">Connect with fellow musicians</p>
                    )}
                </div>
            </div>
            <Button onClick={onLogout} variant="outline" size="sm">
                Logout
            </Button>
        </div>
    );
}