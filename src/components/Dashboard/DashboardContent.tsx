import { SidebarInset } from "../ui/sidebar";
import { Network } from "../Network/Network";
import { DashboardHeader } from "./DashboardHeader";
import { UserProfileCard } from "./UserProfileCard";
import { DashboardCardsGrid } from "./DashboardCardsGrid";
import { RecentActivityTable } from "./RecentActivityTable";

interface DashboardContentProps {
    user: any;
    onLogout: () => Promise<void>;
    currentView: 'dashboard' | 'network';
}

export function DashboardContent({ user, onLogout, currentView }: DashboardContentProps) {
    return (
        <SidebarInset className="min-h-screen bg-background/95">
            <div className="w-full px-4 py-6 space-y-8">
                <DashboardHeader user={user} onLogout={onLogout} currentView={currentView} />
                {currentView === 'dashboard' ? (
                    <>
                        <UserProfileCard user={user} />
                        <DashboardCardsGrid user={user} />
                        <RecentActivityTable />
                    </>
                ) : (
                    <Network />
                )}
            </div>
        </SidebarInset>
    );
}