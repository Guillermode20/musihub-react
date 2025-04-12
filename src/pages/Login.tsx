import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { pocketbaseService } from "../lib/pocketbase";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await pocketbaseService.login(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid email or password");
            console.error("Login error:", err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-md">
                <Card className="p-6 space-y-6">
                    <CardHeader>
                        <h2 className="text-2xl font-bold text-center">Login</h2>
                        {error && (
                            <p className="text-sm text-red-500 text-center mt-2">{error}</p>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link to="/register">Create an Account</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
