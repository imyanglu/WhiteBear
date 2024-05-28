import { Music } from "@/type"
import { get } from "./instance"

export const getRandMusics = (num: number): Promise<{ code: number, data: Music }[]>=> { 
    return Promise.allSettled(Array.from({length:num}).map(()=>get('https://api.uomg.com/api/rand.music?sort=热歌榜&format=json'))).then(d=>d.map(v=>v.status==='fulfilled'?v.value :undefined).filter(i=>i)) as any
}