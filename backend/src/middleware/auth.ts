import jwt from 'jsonwebtoken';
import{config} from 'dotenv';

config();

const secret:string = process.env.JWT_SECRET || "mysecretkey" ;


export const auth = async (req:any,res:any,next:any)=>{
    const token:string= req.cookies.token;
    if(!token){
        return res.status(401).json({message:"You are not authorized"});
    }

    try {
       
        if (!secret) {
            return res.status(500).json({ message: "JWT secret is not defined" });
        }
        const decoded =  jwt.verify(token, secret);
        
        req.user = decoded;
    
        next();

        }
       
        
     catch (error) {

        console.error(error);
        return res.status(500).json({message:"Internal server error"});
        
    }

   }

  