import { Kafka } from 'kafkajs';
import { PrismaClient } from '@prisma/client';
import { parse } from './parse';
import { JsonObject } from '@prisma/client/runtime/library';


const prismaClient = new PrismaClient();
const TOPIC_NAME="zap-event";

const kafka = new Kafka({
    clientId:"outbox-processor-2",
    brokers: ['localhost:9092']
})


async function main() {
    const consumer = kafka.consumer({ groupId: 'main-worker-2' });
    await consumer.connect();
    const producer =  kafka.producer();
    await producer.connect();

    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true })

    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
        //   console.log({
        //     partition,
        //     offset: message.offset,
        //     value: message.value?.toString(),
        //   })
        //   if (!message.value?.toString()) {
        //     return;
        //   }

        //   const parsedValue = JSON.parse(message.value?.toString());
        // console.log("Raw message value:", message.value);
            
        try {
            // Ensure message value exists and is a string
            if (!message.value) {
                console.log("Empty message value");
                return;
            }

            const valueString = message.value.toString().trim();
            console.log("Value string:", valueString);

            // Add more robust parsing
            const parsedValue = JSON.parse(valueString);
            console.log("Parsed value:", parsedValue);

            // Rest of your existing logic...
        


          const zapRunId = parsedValue.zapRunId;
          const stage = parsedValue.stage;

          const zapRunDetails = await prismaClient.zapRun.findFirst({
            where: {
              id: zapRunId
            },
            include: {
              zap: {
                include: {
                  actions: {
                    include: {
                      type: true
                    }
                  }
                }
              },
            }
          });
          const currentAction = zapRunDetails?.zap.actions.find(x => x.sortingOrder === stage);

          if (!currentAction) {
            console.log("Current action not found?");
            return;
          }

          const zapRunMetadata = zapRunDetails?.metadata;

          if (currentAction.type.id === "email") {
            const body = parse((currentAction.metadata as JsonObject)?.body as string, zapRunMetadata);
            const to = parse((currentAction.metadata as JsonObject)?.email as string, zapRunMetadata);
            console.log(`Sending out email to ${to} body is ${body}`)
           
          }

          if (currentAction.type.id === "send-sol") {

            const amount = parse((currentAction.metadata as JsonObject)?.amount as string, zapRunMetadata);
            const address = parse((currentAction.metadata as JsonObject)?.address as string, zapRunMetadata);
            console.log(`Sending out SOL of ${amount} to address ${address}`);

             
          }
          
          // 
          await new Promise(r => setTimeout(r, 500));

          const lastStage = (zapRunDetails?.zap.actions?.length || 1) - 1; // 1
          console.log(lastStage);
          console.log(stage);
          if (lastStage !== stage) {
            console.log("pushing back to the queue")
            await producer.send({
              topic: TOPIC_NAME,
              messages: [{
                value: JSON.stringify({
                  stage: stage + 1,
                  zapRunId
                })
              }]
            })  
          }

          console.log("processing done");
          // 
          await consumer.commitOffsets([{
            topic: TOPIC_NAME,
            partition: partition,
            offset: (parseInt(message.offset) + 1).toString() // 5
          }])
        } catch (error) {
            console.error("Error processing message:", error);
            // Optional: handle or log the error appropriately
        }
        },
      })

}

main()