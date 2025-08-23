import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express"
import {validate} from "uuid"

export class UserController {
  constructor (public prisma: PrismaClient) {}

  getUserInformation = async (req: Request, res: Response) => {
    const {id: userId} = req.params

    if (!userId) {
      res.status(400).json({error: "There is no user id"})
      return
    }

    if (!validate(userId)) {
      res.status(400).json({error: "Invalid user id format. It should be uuid"})
      return
    }

    const user = await this.prisma.user.findUnique({
      where: {id: userId}
    })

    if (!user) {
      // 404: can't find the resources/data
      res.status(404).json({error: "There is no this user profile"})
      return
    }

    res.json(user)
  }

  updateUserInformation = async (req: Request, res: Response) => {
    const {id: userId} = req.params

    if (!userId) {
      res.status(400).json({error: "There is no user id"})
      return
    }

    if (!validate(userId)) {
      res.status(400).json({error: "Invalid user id format. It should be uuid"})
      return
    }

    if (!req.body) {
      res.status(400).json({error: "There is no user information for update"})
    }

    const user = await this.prisma.user.update({
      where: {id: userId},
      data: req.body
    })

    res.json(user)
  }
}