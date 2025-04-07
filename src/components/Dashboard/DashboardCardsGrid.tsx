import { Card, CardHeader, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface DashboardCardsGridProps {
    user: any;
}

export function DashboardCardsGrid({ user }: DashboardCardsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Activity Summary</h2>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Recent activity and stats</p>
                        <div className="mt-4 space-y-3">
                            <div className="flex justify-between items-center">
                                <span>Total Sessions</span>
                                <Badge variant="secondary">24</Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Last Active</span>
                                <span className="text-sm text-muted-foreground">Today</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                    <h2 className="text-xl font-semibold">User Details</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">User ID</p>
                            <p className="font-mono text-xs mt-1">{user.$id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <p className="mt-1">{user.status}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Registered</p>
                            <p className="mt-1">{new Date(user.registration * 1000).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Email Status</p>
                            <p className="mt-1">{user.emailVerification ? 'Verified' : 'Pending'}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                    <h2 className="text-xl font-semibold">Quick Actions</h2>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Button className="w-full justify-start" variant="outline">
                            Edit Profile
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                            Security Settings
                        </Button>
                        <Button className="w-full justify-start" variant="outline">
                            Notifications
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}