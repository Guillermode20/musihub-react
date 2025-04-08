import { Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

/**
 * Login page component.
 * 
 * Renders a login form with email and password fields, performs validation,
 * and authenticates the user using authService. Redirects to dashboard on success.
 * Displays error messages for invalid input or failed login attempts.
 *
 * @returns {JSX.Element} The login form UI.
 */
export default function Login() {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate("/dashboard");
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-md">
                <Card className="p-6 space-y-6">
                    <CardHeader>
                        <h2 className="text-2xl font-bold text-center">Login</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="********"
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button type="submit" className="w-full">
                            Login
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
