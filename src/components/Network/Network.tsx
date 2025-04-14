import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/card";
import { NetworkSearch, NetworkMessages, NetworkForum } from ".";

export function Network() {
    return (
        <div className="w-full p-6 space-y-6">

            <Tabs defaultValue="search" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="search">Find Creatives</TabsTrigger>
                    <TabsTrigger value="messages">Messages</TabsTrigger>
                    <TabsTrigger value="forum">Forum</TabsTrigger>
                </TabsList>

                <TabsContent value="search">
                    <Card className="p-6">
                        <NetworkSearch />
                    </Card>
                </TabsContent>

                <TabsContent value="messages">
                    <Card className="p-6">
                        <NetworkMessages />
                    </Card>
                </TabsContent>

                <TabsContent value="forum">
                    <Card className="p-6">
                        <NetworkForum />
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}