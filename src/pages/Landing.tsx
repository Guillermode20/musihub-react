import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Music, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

function LandingContent() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
            {/* Navigation Bar */}
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6">
                <div className="flex items-center gap-2">
                    <Music className="h-6 w-6 text-primary" />
                    <h1 className="text-xl font-semibold tracking-tight">MusiHub</h1>
                </div>
                {/* Simplified Nav for a warmer feel */}
                <nav className="hidden md:flex items-center gap-6 ml-8">
                    <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Dashboard</Link>
                    <Link to="/register" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Register</Link>
                </nav>
                <div className="ml-auto flex items-center gap-3">
                    <Button variant="ghost" size="sm">Log In</Button>
                    <Button size="sm">Join the Community</Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        aria-label="Toggle theme"
                    >
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center py-24 px-4 text-center bg-gradient-to-b from-background via-background to-muted/30">
                <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                    Make Your Stage.
                </h2>
                <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                    Connect with musicians, share your sound, and discover local talent.
                </p>
                <div className="mt-10 flex gap-4">
                    <Link to="/register">
                        <Button size="lg">Join Now</Button>
                    </Link>
                    <Link to="/login">
                        <Button variant="outline" size="lg">Log In</Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-10 px-4 bg-muted/30">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                    <div>
                        <h4 className="font-semibold mb-1">MusiHub England</h4>
                        <p className="text-sm text-muted-foreground">Built by musicians, for musicians across England.</p>
                    </div>
                    <nav className="flex gap-4 items-center text-sm">
                        <a href="#" className="text-muted-foreground hover:text-primary">About</a>
                        <a href="#" className="text-muted-foreground hover:text-primary">Help</a>
                        <a href="#" className="text-muted-foreground hover:text-primary">Terms</a>
                    </nav>
                </div>
                <div className="text-center text-xs text-muted-foreground mt-6">
                    © {new Date().getFullYear()} MusiHub. Made with <Heart className="inline h-3 w-3" /> for local music.
                </div>
            </footer>
        </div>
    );
}

export default LandingContent;
