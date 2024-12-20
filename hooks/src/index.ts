// import express from "express";
// import { PrismaClient } from "@prisma/client";

// const app = express();
// app.use(express.json());
// const client= new PrismaClient();
 

// app.post("/hooks/catch/:userId/:zapId", async( req , res)=>{
      
//     const userId=req.params.userId;
//     const zapId=req.params.zapId;
//     const body=req.body

//    // Add this before your transaction code:
// console.log("Incoming zapId:", zapId, "Type:", typeof zapId);


//     // store in db a new trigger
     
//     try {

        
        
//     await client.$transaction(async tx=>{
    
//         const run= await tx.zapRun.create({
//             data:{
//                 zapId:zapId,
//                 metadata:body
//             }
//         });

//         await tx.zapRunOutbox.create({
//             data:{
//                 zapRunId:run.id
//             }
//         })
          
//     })

//     res.json({
//         message : "WebHook recieved"
//     }) 
//     } catch (error) {
//          console.log(error);
         
//     }
   


// })


// app.listen(3002);

import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
app.use(express.json());
const client = new PrismaClient({
    log: ['query', 'error'], // Enable query logging
});

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;

    try {
        // Try creating without a transaction first
        const run = await client.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
        });

        const outbox = await client.zapRunOutbox.create({
            data: {
                zapRunId: run.id
            }
        });

        res.json({
            message: "WebHook received",
            runId: run.id
        });
    } catch (error: unknown) {
        console.log("Detailed error:", {
            error: error instanceof Error ? error.message : String(error),
            code: error && typeof error === 'object' && 'code' in error ? error.code : undefined,
            meta: error && typeof error === 'object' && 'meta' in error ? error.meta : undefined
        });

        // Try to get more information about the Zap
        try {
            const zap = await client.zap.findUnique({
                where: { id: zapId }
            });
            console.log("Zap lookup result:", zap);
        } catch (lookupError) {
            console.log("Zap lookup error:", lookupError);
        }

        res.status(500).json({
            message: "Error processing webhook",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

app.listen(3002);