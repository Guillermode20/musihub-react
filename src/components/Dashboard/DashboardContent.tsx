import { UserProfileCard } from "./UserProfileCard";
import { DashboardCardsGrid } from "./DashboardCardsGrid";
import { RecentActivityTable } from "./RecentActivityTable";

interface DashboardContentProps {
    user: any;
}

export function DashboardContent({ user }: DashboardContentProps) {
    return (
        <div className="space-y-8">
            <UserProfileCard user={user} />
            <DashboardCardsGrid user={user} />
            <RecentActivityTable />
        </div>
    );
}