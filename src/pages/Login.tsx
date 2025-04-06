import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function Login() {
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md p-6 space-y-6">
                <CardHeader>
                    <h2 className="text-2xl font-bold text-center">Login</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="********" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Login</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
