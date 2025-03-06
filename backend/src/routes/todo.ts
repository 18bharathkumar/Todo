import { Router } from "express";
import { prisma } from "../index";
import { auth } from "../middleware/auth";



const router = Router();

router.post("/addTodo", auth, async (req: any, res: any) => {
    const { title, discription } = req.body;

    if(!title || !discription){
        return res.status(400).json({ message: "All fields must be filled" });
    }

    const userId = req.user.id;
    try {

        const todo = await prisma.todo.create({
            data: {
                title: title,
                discription: discription,
                userId: userId,
            },
        });

        res.status(201).json(todo);
        
    } catch (error) {
        console.error("the error is",error);
        res.status(500).json({ message: "Internal server error" });

        
    }
});

router.get("/getTodo", auth, async (req: any, res: any) => {
    const userId = req.user.id;
    try {

        const todo = await prisma.todo.findMany({
            where: {
                userId: userId,
            },
        });

        res.status(200).json(todo);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });

        
    }
});

router.put("/updateTodo/:id", auth, async (req: any, res: any) => {
    const { title, discription } = req.body;
    const todoId = Number(req.params.id);

    try {

        const todo = await prisma.todo.update({
            where: {
                id: todoId,
            },
            data: {
                title: title,
                discription: discription,
            },
        });

        res.status(200).json(todo);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });

        
    }

});

router.put("/:id/done",auth, async(req:any,res:any)=>{ 
    const todoId = Number(req.params.id);
    try {
        const todo = await prisma.todo.update({
            where: {
                id: todoId,
            },
            data: {
                done: true,
            },
        });

        res.status(200).json(todo);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });

        
    }
})

router.delete("/deleteTodo/:id", auth, async (req: any, res: any) => {
    const todoId = Number(req.params.id);

    try {

        const todo = await prisma.todo.delete({
            where: {
                id: todoId,
            },
        });

        res.status(200).json(todo);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });

        
    }

});

export default router;

