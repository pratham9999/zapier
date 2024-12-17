import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());
const client= new PrismaClient();
 

app.post("/hooks/catch/:userId/:zapId", async( req , res)=>{
      
    const userId=req.params.userId;
    const zapId=req.params.zapId;
    const body=req.body


    // store in db a new trigger
     
    try {
        
    await client.$transaction(async tx=>{

        const run= await tx.zapRun.create({
            data:{
                zapId:zapId,
                metadata:body
            }
        });

        await tx.zapRunOutbox.create({
            data:{
                zapRunId:run.id
            }
        })
          
    })

    res.json({
        message : "WebHook recieved"
    }) 
    } catch (error) {
         console.log(error);
         
    }
   


})


app.listen(3002);