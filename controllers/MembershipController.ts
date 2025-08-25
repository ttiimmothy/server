import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express"

export class MembershipController {
  constructor (public prisma: PrismaClient) {}

  getMembership = async (req: Request, res: Response) => {
    const {id} = req.params
    const subscription = await this.prisma.subscription.findUnique({
      where: {userId: id}
    })
    
    res.json(subscription)
  }

  updateMembership = async (req: Request, res: Response) => {
    const {id} = req.params
    const membership = await this.prisma.subscription.upsert({
      where: {userId: id},
      update: req.body,
      create: req.body
    })
    res.json(membership)
  }
}