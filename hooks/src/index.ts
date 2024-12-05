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
    // push it on to queue (kafka/redis)

    await client.$transaction(async tx=>{

     
        

        const run=await client.zapRun.create({
            data:{
                zapId:zapId,
                metadata:body
            }
        });

        await client.zapRunOutbox.create({
            data:{
                zapRunId:run.id
            }
        })



                
    })

    res.json({
        message : "WebHook recieved"
    })
   


})


app.listen(3000);