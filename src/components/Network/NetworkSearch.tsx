import { Input } from "../ui/input";
import useDebounce from "../../hooks/useDebounce";
import { pocketbaseService } from "../../lib/pocketbase";
import { useState, useEffect } from "react";
import { ProfileCard } from "./ProfileCard";

export function NetworkSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [profile, setProfile] = useState<any>(null);

    const handleSearch = async (term: string) => {
        if (term) {
            const profile = await pocketbaseService.getProfilebyName(term);
            console.log("Search Results:", profile);
            setProfile(profile);
        }
    };

    useEffect(() => {
        if (debouncedSearchTerm) {
            handleSearch(debouncedSearchTerm);
        } else {
            setProfile(null);
        }
    }, [debouncedSearchTerm]);

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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="py-8 text-center text-muted-foreground">
                {profile ? (
                    <ProfileCard profile={profile} />
                ) : null}
            </div>
        </div>
    );
}