import {User} from "@prisma/client";
import {Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken"

export class AuthMiddleware {
  verifyToken = async (req: Request & {user: Omit<User, "password">}, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
    if (!token) {
      res.status(401).json({error: "Unauthorized"})
      return
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!)
      req.user = payload
      next()
    } catch (e) {
      res.status(401).json({error: "Invalid token"})
    }
  }
}