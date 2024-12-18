import { PrismaClient } from "@prisma/client";
import {Kafka} from "kafkajs"
const client = new PrismaClient();
const TOPIC_NAME= "zap-event"

const kafka = new Kafka({
      clientId : 'outbox-processor',
      brokers : ['localhost:9092']
})


async function main() {

      const producer = kafka.producer();
      await producer.connect();
      
      while(1){
        const pendingRows=await client.zapRunOutbox.findMany({
            where:{},
            take:10
        })
           
        console.log(pendingRows);
         


      //   producer.send({
      //       topic: TOPIC_NAME,
      //       messages: pendingRows.map(r => ({
      //           value: JSON.stringify({
      //               zapRunId: r.zapRunId,
      //               stage: 0
      //           })
      //       }))
      //   });

      const messages = pendingRows.map(r => {
            const message = { 
                zapRunId: r.zapRunId, 
                stage: 0 
            };
            console.log("Sending message:", JSON.stringify(message));
            return {
                value: JSON.stringify(message)
            }
        });

        try {
            await producer.send({
                topic: TOPIC_NAME,
                messages: messages
            });
        } catch (error) {
            console.error("Error sending to Kafka:", error);
        }


       
        
      
        await client.zapRunOutbox.deleteMany({
            where : {
                  id : {
                        in : pendingRows.map(x=> x.id)
                  }
            }
        })

          await new Promise(r=>setTimeout(r,3000));
         
      }
}

main()