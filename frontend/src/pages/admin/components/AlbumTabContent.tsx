import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Library } from "lucide-react"
import AlbumsTable from "./AlbumsTable.tsx"
import AddAlbumDialog from "./AddAlbumDialog.tsx"
import { useMusicStore } from "@/stores/useMusicStore.ts"

const AlbumTabContent = () => {
  const { fetchAlbums } = useMusicStore();
  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
     <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Library className="size-5 text-violet-500"/>
            Albums Library
          </CardTitle>
          <CardDescription className="text-zinc-400">Manage your library of albums</CardDescription>
        </div>
        <AddAlbumDialog fetchAlbums={fetchAlbums} />
      </div>
     </CardHeader>
     <CardContent>
      <AlbumsTable />
     </CardContent>
    </Card>
  )
}

export default AlbumTabContent
