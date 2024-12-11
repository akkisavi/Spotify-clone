import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Music } from "lucide-react"
import SongsTable from "./SongsTable"
import AddSongButton from "./AddSongDialog"

const SongsTabContent = () => {
  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Music className="size-5 text-emerald-500"/>
              Songs Library
            </CardTitle>
            <CardDescription className="text-zinc-400">Manage your library of songs.</CardDescription>
          </div>
          <AddSongButton />
        </div>
      </CardHeader>
      <CardContent>
        <SongsTable />
      </CardContent>
    </Card>
  )
}

export default SongsTabContent