export type Music = {
    artistsname: string;
    name: string;
    picurl: string;
    url: string;
}
export type SearchMusic = 
    {
    songId: string;
    name: string,
    singers: string,
    image:string,
    src: {
      type:string
    }
}
export type WyMusic = {
    id: number;
    name: string;
    picUrl: string;
    
}