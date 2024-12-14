import { Router } from "express";
import { prismaClient } from "../db";



const router = Router();

router.get("/available", async (req, res) => {
    try {

        const availableActions = await prismaClient.availableAction.findMany({});
        res.json({
            availableActions
        })
        
    } catch (error) {
        console.log(error);
        
    }
   
});

export const actionRouter = router;