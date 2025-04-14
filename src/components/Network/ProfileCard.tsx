interface Profile {
    id: string;
    name: string;
    email: string;
    bio: string;
    location: string;
    userId: string;
}

interface ProfileCardProps {
    profile: Profile | null;
}

export function ProfileCard({ profile }: ProfileCardProps) {
    if (!profile) {
        return (
            <div className="text-muted-foreground text-center p-4 border rounded-lg">
                <p>No profile found.</p>
                <p className="text-sm mt-2">Profile data is null or undefined</p>
                <p className="text-sm">Expected Profile type with properties: id, name, email, bio, location, userId</p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-lg shadow-md p-4 space-y-2">
            <h3 className="text-lg font-semibold">{profile.name}</h3>
            <p className="text-muted-foreground">{profile.bio}</p>
            <div>
                <strong>Location:</strong> {profile.location}
            </div>
            <div>
                <strong>Email:</strong> {profile.email}
            </div>
            <div>
                <strong>User ID:</strong> {profile.userId}
            </div>
        </div>
    );
}