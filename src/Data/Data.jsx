import { FaFilm, FaQq, FaSmileWink } from "react-icons/fa";
import { FaMapLocation } from "react-icons/fa6";
import { GiAngelOutfit } from "react-icons/gi";
import { IoGameController, IoMusicalNote } from "react-icons/io5";
import { MdEmojiNature } from "react-icons/md";

export const category=[
    {id:1,name:"Games", icon:<IoGameController size={30}></IoGameController>},
    {id:2,name:'Funny', icon:<FaSmileWink size={30}></FaSmileWink>},
    {id:3,name:'Stories', icon:<FaQq size={30}></FaQq>},
    {id:4,name:'Movies', icon:<FaFilm size={30}></FaFilm>},
    {id:5,name:'Anime', icon:<GiAngelOutfit size={30}></GiAngelOutfit>},
    {id:6,name:'Music', icon:<IoMusicalNote size={30}></IoMusicalNote>},
    {id:7,name:'Nature', icon:<MdEmojiNature size={30}></MdEmojiNature>},
]

export const locationIcon=<FaMapLocation></FaMapLocation>