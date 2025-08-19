import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class LoginController {
  constructor(public prisma: PrismaClient) {}

  login = async (req: Request, res: Response) => {
    const {email, password} = req.body

    if (!email || !password) {
      res.status(400).json({error: "email or password is missing"})
      return
    }

    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      res.status(401).json({error: "There is no this user"})
      return
    } 

    const match = await bcrypt.compare(password, user.password)
    
    if (!match) {
      res.status(401).json({error: "Invalid credentials"})
    }
    const {password: _pwd, ...userPayload} = user

    const token = jwt.sign(userPayload, process.env.JWT_SECRET!)

    res.cookie("accessToken", token, {
      httpOnly: true,
      // secure: true, // Only over HTTPS
      sameSite: "strict", // Protect against CSRF 
    })

    res.json({user: user.email})
  }
}