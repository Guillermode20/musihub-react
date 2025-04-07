import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";

export function NetworkForum() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Community Forum</h2>
                <p className="text-muted-foreground">Discuss music, share experiences, and learn from the community</p>
            </div>

            <div className="flex justify-end">
                <Button variant="outline">New Discussion</Button>
            </div>

            <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <p>Forum functionality coming soon...</p>
                    <p className="text-sm">This is where you'll be able to participate in community discussions</p>
                </div>
            </ScrollArea>
        </div>
    );
}