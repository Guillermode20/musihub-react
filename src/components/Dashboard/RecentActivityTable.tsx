import { Card, CardHeader, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Table } from "../ui/table";

export function RecentActivityTable() {
    return (
        <div className="mt-8">
            <Card>
                <CardHeader className="pb-0">
                    <h2 className="text-xl font-semibold">Recent Activity</h2>
                    <p className="text-sm text-muted-foreground mt-1">Your latest actions and updates</p>
                </CardHeader>
                <CardContent className="p-6">
                    <Table>
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-3 text-muted-foreground font-medium">Date</th>
                                <th className="text-left p-3 text-muted-foreground font-medium">Activity</th>
                                <th className="text-left p-3 text-muted-foreground font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b">
                                <td className="p-3">{new Date('2025-04-01').toLocaleDateString()}</td>
                                <td className="p-3">Logged in from new device</td>
                                <td className="p-3">
                                    <Badge variant="outline" className="bg-green-50">Success</Badge>
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-3">{new Date('2025-04-02').toLocaleDateString()}</td>
                                <td className="p-3">Updated profile information</td>
                                <td className="p-3">
                                    <Badge variant="outline" className="bg-green-50">Success</Badge>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-3">{new Date('2025-04-03').toLocaleDateString()}</td>
                                <td className="p-3">Password change requested</td>
                                <td className="p-3">
                                    <Badge variant="secondary">Pending</Badge>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}