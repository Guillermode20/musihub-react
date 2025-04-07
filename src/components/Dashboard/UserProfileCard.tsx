import { Card, CardContent } from "../ui/card";
import { Avatar } from "../ui/avatar";
import { Badge } from "../ui/badge";

interface UserProfileCardProps {
    user: any;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
    return (
        <Card className="bg-primary/5 border-primary/10">
            <CardContent className="p-6">
                <div className="flex items-center space-x-6">
                    <Avatar className="w-16 h-16 border-2 border-primary">
                        <img
                            src={user.prefs?.avatarUrl || "https://via.placeholder.com/40"}
                            alt="User Avatar"
                            className="rounded-full"
                        />
                    </Avatar>
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold">{user.name || "Unnamed User"}</h2>
                        <p className="text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">Active</Badge>
                            {user.emailVerification && <Badge variant="outline">Verified</Badge>}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}