import {User} from "@prisma/client";
import {Request, Response, NextFunction} from "express"
import {verify} from "jsonwebtoken"

export class AuthMiddleware {
  verifyJsonWebToken = async (req: Request & {user: Omit<User, "password">}, res: Response, next: NextFunction) => {
    // if I use cookies, but cookies can't delete in the expo app when logout becuase it isn't website
    // const token = req.cookies.accessToken
    // if (!token) {
    //   res.status(401).json({error: "Unauthorized"})
    //   return
    // }
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer")) {
      res.status(401).json({error: "Unauthorized"})
      return
    }

    const token = req.headers.authorization.split(" ")[1]

    try {
      const payload = verify(token, process.env.JWT_SECRET)
      req.user = payload
      next()
    } catch (e) {
      // 401: Unauthorized
      res.status(401).json({error: "Invalid token"})
    }
  }
}