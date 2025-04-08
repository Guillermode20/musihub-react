import pb from '../lib/pocketbase';
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

/**
 * Register page component.
 * 
 * Renders a user registration form with name, email, password, and confirm password fields.
 * Validates input, creates a new user account via authService, and redirects to login on success.
 * Displays validation and server error messages.
 *
 * @returns {JSX.Element} The registration form UI.
 */
export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setGeneralError(null);
        setErrors({});

        if (password !== confirmPassword) {
            setErrors({ confirmPassword: "Passwords do not match" });
            setLoading(false);
            return;
        }

        try {
            const userData = {
                email,
                password,
                passwordConfirm: confirmPassword,
                name,
            };
            const createdUser = await pb.collection('users').create(userData);
            console.log('Registration success:', createdUser);

            // Auto-login after registration
            await pb.collection('users').authWithPassword(email, password);
            navigate("/dashboard");
        } catch (error: any) {
            console.error('Registration error:', error);
            if (error?.response?.data) {
                setErrors(error.response.data);
            } else {
                setGeneralError("Registration failed. Please try again.");
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
                        <h2 className="text-2xl font-bold text-center">Create an Account</h2>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {generalError && (
                            <p className="text-red-500 text-center">{generalError}</p>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
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
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="********"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Registering..." : "Register"}
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link to="/login">Login Instead</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
