import { Music } from "@/type"
import { get } from "./instance"

export const getRandMusics = (num: number): Promise<{ code: number, data: Music }[]>=> { 
    return Promise.allSettled(Array.from({length:num}).map(()=>get('https://api.uomg.com/api/rand.music?sort=热歌榜&format=json'))).then(d=>d.map(v=>v.status==='fulfilled'?v.value :undefined).filter(i=>i)) as any
}
export const getRandomMusic = () :Promise<{ code: number, data: Music }>=> { 
    return get('https://api.uomg.com/api/rand.music?sort=热歌榜&format=json')
}
export const getSearchMusic = (name:string): Promise<{ code: number, data: Music }[]> => { 
    return get<{code:0,data:Music[]}>(`https://oiapi.net/API/Music_163?name=${name}`).then(data => { 
        console.log(data)
        return data
    })
}