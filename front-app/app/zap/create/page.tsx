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

    const [selectedTrigger , setSelectedTrigger] = useState<{
        id :string,
        name :string
    }>();
    const [selectedActions , setSelectedActions] = useState<{
        index : number
        availableActionId : string;
        availableActionName : string;
    }[]>([]);
    const [selectedModalIndex , setSelectedModalIndex] = useState<null|number>(null)

    return <div>
     <Appbar/>
   
   <div className="w-full min-h-screen bg-slate-200 flex flex-col justify-center">
          <div className="flex justify-center w-full">
         <ZapCell onClick={()=>{
            setSelectedModalIndex(1);
         }} name={selectedTrigger?.name ? selectedTrigger.name : "Trigger"} index = {1}/>
         </div>

         <div className="w-full pt-2 pb-2">
            {selectedActions.map ((action , index)=> <div className="flex justify-center" key={index}><ZapCell onClick={()=>{
            setSelectedModalIndex(action.index)
            }} name={action.availableActionName ? action.availableActionName : "Action"} index={2 + index} /> </div>)}
         </div>
         <div className="flex justify-center">
         <div>
         <PrimaryButton onClick={()=>{
            setSelectedActions(a=> [...a , {
                index : a.length + 2,
                availableActionId : "",
                availableActionName: ""
            }])
         }}> <div className="text-2xl"> + </div> </PrimaryButton>
    </div>
    </div>
   </div>
       
     {selectedModalIndex && <Modal onSelect={(props : null |  {name :string , id : string})=>{
             
             if(props===null){
                setSelectedModalIndex(null);
                return;
             } 

             if(selectedModalIndex===1){
                 setSelectedTrigger({
                    id: props.id,
                    name : props.name
                 })
             }else{
                setSelectedActions(a=>{
                    // eslint-disable-next-line prefer-const
                    let newActions = [...a];
                    newActions[selectedModalIndex - 2] = {
                        index: selectedModalIndex,
                        availableActionId: props.id,
                        availableActionName: props.name,
                    }
                    return newActions
                })
             }

        setSelectedModalIndex(null)
     }} index={selectedModalIndex}/>}
        
    </div>

}


function Modal ({index , onSelect} :{ 
    index : number,
    onSelect : (props : null |  {name :string , id : string})=> void
}) {
   return<div className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-slate-100 bg-opacity-70 flex">
   <div className="relative p-4 w-full max-w-2xl max-h-full">
       <div className="relative bg-white rounded-lg shadow ">
           <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
               <div className="text-xl">
                   Select {index === 1 ? "Trigger" : "Action"}
               </div>
               <button onClick={() => {
                   onSelect(null);
               }} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="default-modal">
                   <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                       <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                   </svg>
                   <span className="sr-only">Close modal</span>
               </button>
           </div>
           <div className="p-4 md:p-5 space-y-4">
                
           </div>
       </div>
   </div>
</div>
}