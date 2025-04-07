import { ScrollArea } from "../ui/scroll-area";

export function NetworkMessages() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Messages</h2>
                <p className="text-muted-foreground">Connect and collaborate with your network</p>
            </div>

            <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <p>Messaging functionality coming soon...</p>
                    <p className="text-sm">You'll be able to chat with other music professionals here</p>
                </div>
            </ScrollArea>
        </div>
    );
}