import { Router } from "express";
import { prisma } from "../index";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "dotenv";

config();

const secret: string = process.env.JWT_SECRET || "mysecretkey";


const router = Router();


router.post("/signup",async (req:any,res:any)=>{
    const {name,email,password} = req.body;

    if(!name || !email || !password){
       return  res.status(400).json({mssg:"all field must be filled"})
    }

    try {

        const user =await prisma.user.findFirst({
            where:{
                OR:[
                    {email:email},
                    {name:name}
                ]
            }
        })
    
        if(user){
           return  res.status(400).json({
            mssg:"user already exist",
            
           })
            
            
        }
    
        const hasedPassword = bcrypt.hashSync(password,10);
    
        const newUser =await prisma.user.create({
            data:{
                name:name,
                email:email,
                password:hasedPassword
            }
        })

        const token = jwt.sign({id:newUser.id,name:newUser.name},secret);

        res.cookie("token",token,{
            httpOnly:true,
            maxAge:3600000*24
        })
        
        
        return res.status(201).json({mssg:"user created successfully",
            name:newUser.name
        },
            
        )
        
    } catch (error) {
        console.error(error);
        res.status(500).json({mssg:"internal server error"})
        
    }
})

router.post("/signin",async (req:any,res:any)=>{

    const {email,password} = req.body;

    try {

        const user =await prisma.user.findFirst({
            where:{
                email:email
            }
        })
    
       
        if (!user) {
            return res.status(400).json({ mssg: "user not found" });
        }
        const isVaild = bcrypt.compare(password, user.password);

        if (!isVaild) {
            return res.status(400).json({ mssg: "password is incorrect" });
        }

        const token = jwt.sign({ id: user.id, name: user.name }, secret);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000*24
        })

        return res.status(200).json({ mssg: "user signin successfully",
            name:user.name
         });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({mssg:"internal server error"})
        
    } 

});

router.post('/logout', (req, res) => {
    // Clear the cookie
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'lax', // or 'strict' depending on your needs
        path: '/', // make sure to use the same path as the one used for setting the cookie
    });
    res.status(200).send('Logout successful, token cookie cleared');
});


export default router;