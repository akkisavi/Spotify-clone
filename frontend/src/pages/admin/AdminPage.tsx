import { useAuthStore } from "@/stores/useAuthStore.ts";
import Header from "./components/Header.tsx";
import DashboardStats from "./components/DashboardStats.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { Album, Music } from "lucide-react";
import SongsTabContent from "./components/SongsTabContent.tsx";
import AlbumTabContent from "./components/AlbumTabContent.tsx";
import { useEffect } from "react";
import { useMusicStore } from "../../stores/useMusicStore.ts";

const AdminPage = () => {
  const { isAdmin, isLoading } = useAuthStore();
  const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
    fetchSongs();
    fetchStats();
  }, [fetchAlbums, fetchSongs, fetchStats]);

  if (!isAdmin && !isLoading) {
    return <div>Unauthorized Access!!</div>;
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 p-8 hide-scrollbar"

    >
      <Header />
      <DashboardStats />

      <Tabs defaultValue="songs" className="space-y-6">
        <TabsList className="p-1 bg-zinc-800/50">
          <TabsTrigger
            value="songs"
            className="data-[state=active]:bg-zinc-700"
          >
            <Music className="mr-2 size-4" />
            Songs
          </TabsTrigger>
          <TabsTrigger
            value="album"
            className="data-[state=active]:bg-zinc-700"
          >
            <Album className="mr-2 size-4" />
            Album
          </TabsTrigger>
        </TabsList>

        <TabsContent value="songs">
          <SongsTabContent />
        </TabsContent>

        <TabsContent value="album">
          <AlbumTabContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
