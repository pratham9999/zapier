import {Request, Response, Router} from "express";
import { authMiddleware } from "../middleware";
import { ZapCreateSchema } from "../types";

const router = Router();
//@ts-ignore
router.post("/" , authMiddleware , async (req : Request , res : Response)  : Promise<any>=>{
    //@ts-ignore
    const id:string = req.id ;
    const body = req.body; 
    const parsedData = ZapCreateSchema.safeParse(body);

    if(!parsedData.success){
        return res.status(411).json({
            message : "Incorrect inputs"
        })
    }



})
//@ts-ignore

router.get("/" , authMiddleware , (req,res)=>{

})
//@ts-ignore
router.get("/:zapId" , authMiddleware , (req , res)=>{

})


export const zapRouter = router;