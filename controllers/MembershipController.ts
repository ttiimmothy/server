import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express"
import {stripe} from "@/.";

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

  getCustomerId = async (req: Request, res: Response) => {
    const {userId, email} = req.body || {}
    const customer = await this.prisma.user.findUnique({
      where: {id: userId}
    })
    if (!customer.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: {appUserId: userId}
      })
      res.json({customerId: customer.id})
      return
    }
    res.json({customerId: customer.id})
  }
}