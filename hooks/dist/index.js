"use strict";
// import express from "express";
// import { PrismaClient } from "@prisma/client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const client = new client_1.PrismaClient({
    log: ['query', 'error'], // Enable query logging
});
app.post("/hooks/catch/:userId/:zapId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;
    try {
        // Try creating without a transaction first
        const run = yield client.zapRun.create({
            data: {
                zapId: zapId,
                metadata: body
            }
        });
        const outbox = yield client.zapRunOutbox.create({
            data: {
                zapRunId: run.id
            }
        });
        res.json({
            message: "WebHook received",
            runId: run.id
        });
    }
    catch (error) {
        console.log("Detailed error:", {
            error: error instanceof Error ? error.message : String(error),
            code: error && typeof error === 'object' && 'code' in error ? error.code : undefined,
            meta: error && typeof error === 'object' && 'meta' in error ? error.meta : undefined
        });
        // Try to get more information about the Zap
        try {
            const zap = yield client.zap.findUnique({
                where: { id: zapId }
            });
            console.log("Zap lookup result:", zap);
        }
        catch (lookupError) {
            console.log("Zap lookup error:", lookupError);
        }
        res.status(500).json({
            message: "Error processing webhook",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
app.listen(3002);
