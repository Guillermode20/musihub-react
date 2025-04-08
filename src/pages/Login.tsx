import pb from '../lib/pocketbase';
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setGeneralError(null);
        setErrors({});

        try {
            const authData = await pb.collection('users').authWithPassword(email, password);
            console.log('Login success:', authData);

            // Fetch user record for additional validation
            const userId = authData.record.id;
            const userRecord = await pb.collection('users').getOne(userId);

            // Example: check if user is active (assuming 'isActive' boolean field exists)
            if (userRecord.isActive === false) {
                setGeneralError("Your account is inactive. Please contact support.");
                await pb.authStore.clear();
                return;
            }

            navigate("/dashboard");
        } catch (error: any) {
            console.error('Login error:', error);
            if (error?.response?.data) {
                setErrors(error.response.data);
            } else {
                setGeneralError("Login failed. Please check your credentials.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <form onSubmit={handleSubmit} className="w-full max-w-md">
                <Card className="p-6 space-y-6">
                    <CardHeader>
                        <h2 className="text-2xl font-bold text-center">Login</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {generalError && (
                            <p className="text-red-500 text-center">{generalError}</p>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
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
