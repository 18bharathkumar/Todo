import { PrismaClient } from "@prisma/client";
import express from "express";
import bodyParser from "body-parser";
import cookiesParser from "cookie-parser";
import userRoute from "./routes/userRoute";
import todoRoute from "./routes/todo";
import cors from "cors";
import { auth } from "./middleware/auth";

export const prisma = new PrismaClient();



const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend origin
  credentials: true, // Allow credentials (cookies, authorization headers)
}));

app.use(bodyParser.json());
app.use(cookiesParser());

app.use("/user", userRoute);
app.use("/todo", todoRoute);



app.get("/", (req: any, res: any) => {
  res.json({ message: "health check" });
 
});

app.get("/getUserName", auth, (req: any, res: any) => {
  const user = req.user;
  console.log(user);
  
  res.json({ name: user.name });  
});

app.get("/logout", (req: any, res: any) => {
  res.clearCookie("token").json({ message: "Logged out" });
});


app.listen(3000, () => {    
    console.log("Server is running on port 3000");
});
    


