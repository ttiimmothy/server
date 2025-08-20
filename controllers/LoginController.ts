import {PrismaClient, User} from "@prisma/client";
import {Request, Response} from "express"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class LoginController {
  constructor(public prisma: PrismaClient) {}

  login = async (req: Request, res: Response) => {
    try {
      const {email, password} = req.body

      if (!email || !password) {
        res.status(400).json({error: "email or password is missing"})
        return
      }

      const user = await this.prisma.user.findUnique({
        where: { email }
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

      const token = jwt.sign(userPayload, process.env.JWT_SECRET, 
        // { expiresIn: "48h" }
      )

      // not use cookies, use expo-secure-store in the client side
      // res.cookie("accessToken", token, {
      //   httpOnly: true,
      //   // secure: true, // Only over HTTPS
      //   sameSite: "strict", // Protect against CSRF
      //   // maxAge: 48 * 60 * 60 * 1000 // 48 hour
      // })

      res.json({user: userPayload, token})
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  currentUser = async (req: Request & {user: Omit<User, "password">}, res: Response) => {
    const user = req.user

    res.json(user)
  }

  logout = async (req: Request, res: Response) => {
    // not use cookies, use expo-secure-store in the client side
    // res.clearCookie("accessToken", {
    //   httpOnly: true,
    //   // secure: true,
    //   sameSite: "strict",
    // })

    return res.json({ message: "logout success" })
  }

  register = async (req: Request, res: Response) => {
    const {email, password} = req.body

    if (!email || !password) {
      res.status(400).json({error: "email or password is missing"})
      return
    }

    const user = await this.prisma.user.findUnique({
      where: { email }
    })

    if (user) {
      res.status(404).json({error: "The email is used"})
      return
    }

    const newUser = await this.prisma.user.create(
      {
        data: {
          email,
          password: await bcrypt.hash(password, 10)
        }
      }
    )

    res.json({user: newUser.id})
  }
}