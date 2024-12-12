/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { Appbar } from "@/components/Appbar"
import { LinkButton } from "@/components/buttons/LinkButton";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { ZapCell } from "@/components/ZapCell";
import { useState } from "react"

/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable react/display-name */

export default function () {

    const [selectedTrigger , setSelectedTrigger] = useState("");
    const [selectedActions , setSelectedActions] = useState<{
        availableActionId : string;
        availableActionName : string;
    }[]>([]);


    return <div>
     <Appbar/>
   
   <div className="w-full min-h-screen bg-slate-200 flex flex-col justify-center">
          <div className="flex justify-center w-full">
         <ZapCell onClick={()=>{}} name={selectedTrigger ? selectedTrigger : "Trigger"} index = {1}/>
         </div>

         <div className="w-full pt-2 pb-2">
            {selectedActions.map ((action , index)=> <div className="flex justify-center" key={index}><ZapCell onClick={()=>{}} name={action.availableActionName ? action.availableActionName : "Action"} index={2 + index} /> </div>)}
         </div>
         <div className="flex justify-center">
         <div>
         <PrimaryButton onClick={()=>{
            setSelectedActions(a=> [...a , {
                availableActionId : "",
                availableActionName: ""
            }])
         }}> <div className="text-2xl"> + </div> </PrimaryButton>
    </div>
    </div>
   </div>
       

        
    </div>

}