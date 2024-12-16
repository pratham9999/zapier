/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/display-name */
/* eslint-disable import/no-anonymous-default-export */
"use client"
import { Appbar } from "@/components/Appbar";
import { DarkButton } from "@/components/buttons/DarkButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL , HOOKS_URL} from "../config";
import { LinkButton } from "@/components/buttons/LinkButton";

interface Zap {
    "id": string,
    "triggerId": string,
    "userId": number,
    "actions": {
        "id": string,
        "zapId": string,
        "actionId": string,
        "sortingOrder": number,
        "type": {
            "id": string,
            "name": string
            "image": string
        }
    }[],
    "trigger": {
        "id": string,
        "zapId": string,
        "triggerId": string,
        "type": {
            "id": string,
            "name": string,
            "image": string
        }
    }

}


function useZaps(){

    const [loading,setLoading] = useState(true);
    const [zaps , setZaps] = useState<Zap[]>([]);

    useEffect(()=>{
        axios.get(`${BACKEND_URL}/api/v1/zap` , {
                headers : {
                    "Authorization" : localStorage.getItem("token")
                }
        }) .then(res=>{
            setZaps(res.data.zaps)
            setLoading(false)
        })

    } , []);

    return {
        loading , zaps
    }

}


export default function (){

    const {loading , zaps} = useZaps();
     const router = useRouter();
    return <div>

        <Appbar />
        <div className="flex justify-center pt-8">
        <div className="max-w-screen-lg w-full">
            <div className="flex justify-between pr-8">
                <div className="text-2xl font-bold">
                    My Zaps
                </div>
                <DarkButton onClick={()=>{
                  router.push("/zap/create")
                }}>Create</DarkButton>
            </div>

        </div>
        </div>
        {loading ? "Loading..." : <div className="flex justify-center"> <ZapTable zaps={zaps} /> </div>}
    </div>
}



function ZapTable({zaps} : {zaps : Zap[]}){
const router = useRouter()
    return <div className="p-8 max-w-screen-lg w-full">
    <div className="grid grid-cols-5 border-b font-bold text-left ">
            <div className="p-4">Name</div>
            <div className="p-4">ID</div>
            <div className="p-4">Created at</div>
            <div className="p-4">Webhook URL</div>
            <div className="p-4">Go</div>
    </div>
    {zaps.map(z => <div className="grid grid-cols-5 border-b py-4 " key={z.id}>
        <div className=" flex p-4"><img key={z.id} src={z.trigger.type.image} className="w-[30px] h-[30px]" alt="myimage" />{z.actions.map((x ,index) => <img key={index} src={x.type.image} className="w-[30px] h-[30px]" alt="myimage"/>)}</div>
        <div className="p-4 break-all">{z.id}</div>
        <div className="p-4" >Nov 13, 2023</div>
        <div className="p-4 break-all">{`${HOOKS_URL}/hooks/catch/1/${z.id}`}</div>
        <div className="p-4" ><LinkButton onClick={() => {
                router.push("/zap/" + z.id)
            }}>Go</LinkButton></div>
    </div>)}
</div>
 }