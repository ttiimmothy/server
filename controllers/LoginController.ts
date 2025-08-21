import {PrismaClient, User} from "@prisma/client";
import {Request, Response} from "express"
import {compare, hash} from "bcryptjs";
import {sign} from "jsonwebtoken";
import {createTransport} from "nodemailer";
// node built-in crypto, haven't installed in the dependencies
import {randomBytes} from "crypto";

export class LoginController {
  constructor(public prisma: PrismaClient) {}

  login = async (req: Request, res: Response) => {
    try {
      const {email, password} = req.body

      console.log("aa")
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

      const match = await compare(password, user.password)
      
      if (!match) {
        res.status(401).json({error: "Invalid credentials"})
        return
      }

      const {password: _pwd, ...userPayload} = user

      const token = sign(userPayload, process.env.JWT_SECRET, 
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

  // logout now can delete token in the expo-secure-store by deleteItemAsync in client, not call the logout api
  // logout = async (req: Request, res: Response) => {
  //   // not use cookies, use expo-secure-store in the client side
  //   // res.clearCookie("accessToken", {
  //   //   httpOnly: true,
  //   //   // secure: true,
  //   //   sameSite: "strict",
  //   // })

  //   return res.json({ message: "logout success" })
  // }

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
          password: await hash(password, 10)
        }
      }
    )

    res.json({user: newUser.id})
  }

  forgetPassword = async (req: Request, res: Response) => {
    const {email} = req.body
    
    if (!email) {
      res.status(400).json({error: "email is missing"})
      return
    }

    const user = await this.prisma.user.findUnique({
      where: {email}
    })

    if (!user) {
      res.status(404).json({error: "this email hasn't been registered"})
      return
    }

    const token = randomBytes(32).toString("hex")
    await this.prisma.passwordResetToken.create(
      {
        data: {
          email,
          token,
          expiresAt: new Date(Date.now() + 30 * 60 * 1000) // expires after 30 min, Date.now() returns milliseconds
        }
      }
    )

    const resetLink = `wormsorburns://reset/password$token=${token}`

    const transporter = createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_APP_USER_EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    })

    await transporter.sendMail({
      from: process.env.EMAIL_APP_USER_EMAIL,
      to: email,
      subject: "Password Reset for app \"Worms or burns\"",
      text: `Hi ${user.displayName ? user.displayName : email},\nTap this link to reset password: ${resetLink}\nThe link will expire after 30 minutes\nThanks`,
       html: `<div>Hi ${user.displayName ? user.displayName : email},</div><p>Tap this link to reset your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <div>The link will expire after 30 minutes</div>
        <div>Thanks</div>`,
    })

    res.json({
      message: "email will be sent if an account exists for this email",
      token
    })
  }

  resetPassword = async (req: Request, res: Response) => {
    const {token, newPassword} = req.body

    if (!token) {
      res.status(400).json({error: "Unauthorized"})
      return
    }

    if (!newPassword) {
      res.status(400).json({error: "There is no new password to reset"})
      return
    }

    const tokenRecord = await this.prisma.passwordResetToken.findUnique({
      where: {
        token
      }
    })

    if (!tokenRecord || !tokenRecord.token) {
      res.status(401).json({ error: "Invalid or expired token" });
      return
    }

    await this.prisma.user.update({
      where: {
        email: tokenRecord.email
      },
      data: {
        password: await hash(newPassword, 10)
      }
    })

    res.json({message: "Password reset successful"})
  }
}