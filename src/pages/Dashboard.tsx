import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Avatar } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Table } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { authService } from "../lib/appwrite";

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
        <div className="min-h-screen p-8 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Dashboard</h1>
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
        </div>
    );
}
