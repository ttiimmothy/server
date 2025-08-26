import {PrismaClient, User} from "@prisma/client";
import {Request, Response} from "express"
import {stripe} from "@/..";
import {planSchema} from "@/lib/zodSchema";
import Stripe from "stripe";

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

  // NOTE: for create customer, using for setupIntent and the intent is used for subscription
  // NOTE: don't need to do this when it is an one-time payment
  getCustomerAndSetupIntent = async (req: Request, res: Response) => {
    try {
      const {id: userId} = req.params
      const {email} = req.body || {}
      let customer = await this.prisma.user.findUnique({
        where: {id: userId}
      })
      if (!customer.stripeCustomerId) {
        const newCustomer = await stripe.customers.create({
          email,
          metadata: {appUserId: userId}
        })

        customer = await this.prisma.user.update({
          where: {id:userId},
          data: {
            stripeCustomerId: newCustomer.id
          }
        })
      }
      const setupIntent = await stripe.setupIntents.create({
        customer: customer.stripeCustomerId,
        payment_method_types: ["card"]
      })
      res.json({clientSecret: setupIntent.client_secret})
    } catch (e) {
      res.status(500).json({error: "failed to create setupIntent"})
    }
  }

  stripeSubscribe = async (req: Request & {user:Omit<User, "password">}, res: Response) => {
    try {
      const appUserId = req.user.id
      const {planId} = req.body
      const parseResult = planSchema.safeParse(planId)
      if (!parseResult) {
        res.status(400).json({error: "invalid planId"})
        return
      }

      const customer = await this.prisma.user.findUnique({
        where: {id: appUserId}
      })

      const priceIds = {
        plan_monthly: "price_1RzvtZPMkA0OsqNAlc3C88sq",
        plan_annual: "price_1RzvruPMkA0OsqNASGGR0LeI"
      }

      const priceId = priceIds[planId]
      if (!priceId) {
        res.status(400).json({error: "The planId is incorrect"})
        return
      }
      const subscription = await stripe.subscriptions.create({
        customer: customer.stripeCustomerId,
        items: [{ price: priceId }],
        collection_method: "charge_automatically",
        payment_behavior: "default_incomplete", // wait for payment confirmation if needed
        payment_settings: {
          payment_method_types: ["card"],
          save_default_payment_method: "on_subscription",
        },
        metadata: {
          userId: appUserId,
          planId
        },
        expand: ["latest_invoice", 'latest_invoice.payments', "latest_invoice.payment_intent"], // NOTE: no .payment_intent here
      });

      // Test: fail
      // type InvoiceWithPI = Stripe.Invoice & {
      //   payment_intent?: Stripe.PaymentIntent
      // };
      // const response = await stripe.invoices.retrieve((subscription.latest_invoice as Stripe.Invoice).id, {
      //   expand: ["payment_intent"],
      // });
      // const invoice = response as InvoiceWithPI;
      // console.log(invoice)
      // const paymentIntent = invoice.payment_intent

      const latestInvoice = subscription.latest_invoice
      let paymentIntentId
      if (typeof latestInvoice !== "string") {
        paymentIntentId = (latestInvoice as Stripe.Invoice).payments.data.find((p) => p.payment?.type === "payment_intent").payment?.payment_intent
      }
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

      res.json({
        subscriptionId: subscription.id,
        status: subscription.status,
        clientSecret: paymentIntent?.client_secret ?? null,
        requiresAction: paymentIntent?.status === "requires_payment_method",
        paymentIntentStatus: paymentIntent?.status
      })
    } catch (e) {
      console.error(e)
      res.status(500).json({error: "failed to subscribe"})
    }
  }
}