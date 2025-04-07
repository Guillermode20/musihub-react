import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function NetworkSearch() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Find Music Creatives</h2>
                <p className="text-muted-foreground">Connect with fellow musicians, producers, and industry professionals</p>
            </div>

            <div className="flex gap-4">
                <Input
                    type="search"
                    placeholder="Search by name, skills, or location..."
                    className="flex-1"
                />
                <Button>Search</Button>
            </div>

            <div className="py-8 text-center text-muted-foreground">
                Search functionality coming soon...
            </div>
        </div>
    );
}