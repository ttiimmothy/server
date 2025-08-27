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

  // for plan_trial to update subscription table
  updateMembership = async (req: Request & {user: Omit<User, "password">}, res: Response) => {
    const userId = req.user.id
    const {
      plan,
      status,
      activeStatus,
      startDate
    } = req.body

    const subscriptionPlan = await this.prisma.availablePlan.findUnique({
      where: {
        planId: plan
      }
    })
    let membership
    if (subscriptionPlan.isTrial) {
      membership = await this.prisma.subscription.upsert({
        where: {userId},
        update: {...req.body, endDate: new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000), canceledAt: null},
        create: {...req.body, endDate: new Date(new Date(startDate).getTime() + 7 * 24 * 60 * 60 * 1000), canceledAt: null, userId},
      })
    } else {
      membership = await this.prisma.subscription.upsert({
        where: {userId},
        update: {...req.body, canceledAt: null},
        create: {...req.body, canceledAt: null, userId},
      })
    }
    res.json(membership)
  }

  // NOTE: for create customer, using for setupIntent and the intent is used for subscription
  // NOTE: don't need to do this when it is an one-time payment
  getCustomerAndSetupIntent = async (req: Request, res: Response) => {
    try {
      const {id: userId} = req.params
      const {email, planId} = req.body || {}
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
      
      const subscriptionPlan = await this.prisma.availablePlan.findUnique({
        where: {planId}
      })

      if (!subscriptionPlan) {
        res.status(400).json({error: "There is no this subscription plan"})
        return
      }

      let setupIntent
      if (subscriptionPlan.isTrial) {
        setupIntent = await stripe.setupIntents.create({
          customer: customer.stripeCustomerId,
          payment_method_types: ["card"]
        })
      }
      
      res.json({clientSecret: setupIntent ? setupIntent.client_secret : null, message: "setupIntent"})
    } catch (e) {
      res.status(500).json({error: "failed to create setupIntent"})
    }
  }

  stripeSubscribe = async (req: Request & {user:Omit<User, "password">}, res: Response) => {
    try {
      const appUserId = req.user.id
      const {planId, defaultPaymentMethod} = req.body
      const parseResult = planSchema.safeParse(planId)
      if (!parseResult) {
        res.status(400).json({error: "invalid planId"})
        return
      }

      const customer = await this.prisma.user.findUnique({
        where: {id: appUserId}
      })

      // const priceIds = {
      //   plan_monthly: "price_1RzvtZPMkA0OsqNAlc3C88sq",
      //   plan_annual: "price_1RzvruPMkA0OsqNASGGR0LeI"
      // }

      // const priceId = priceIds[planId]
      const plan = await this.prisma.availablePlan.findUnique({
        where: {
          planId
        }
      })
      if (!plan) {
        res.status(400).json({error: "The planId is incorrect"})
        return
      }
      const subscription = await stripe.subscriptions.create({
        customer: customer.stripeCustomerId,
        items: [{ price: plan.stripePriceId }],
        // collection_method: "charge_automatically",
        payment_behavior: "default_incomplete", // wait for payment confirmation if needed
        payment_settings: {
          // NOTE: save the payment method for plan renewal charge use
          payment_method_types: ["card"],
          save_default_payment_method: "on_subscription",
        },
        metadata: {
          userId: appUserId,
          planId
        },
        expand: ["latest_invoice", 'latest_invoice.payments', "latest_invoice.payment_intent"], // NOTE: no .payment_intent here
        ...(plan.isTrial ? 
          {trial_period_days: 7} : {}
        ),
        ...(defaultPaymentMethod ?
          {default_payment_method: defaultPaymentMethod} : {}
        )
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

  cancelSubscription = async (req: Request & {user: Omit<User, "password">}, res: Response) => {
    const appUserId = req.user.id
    const subscription = await this.prisma.subscription.findUnique({
      where: {userId: appUserId}
    })

    if (!subscription) {
      res.status(400).json({error: "This user hasn't subscribed before"})
      return
    }

    const subscriptionPlan = await this.prisma.availablePlan.findUnique({
      where: {planId: subscription.plan}
    })
    if (subscriptionPlan.isTrial) {
      const subscription = await this.prisma.subscription.update({
        where: {userId: appUserId},
        data: {
          status: "past_due",
          activeStatus: false,
          canceledAt: new Date()
        }
      })
      res.json(subscription)
    } else if (subscriptionPlan.isTrial === false) {
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true,
      })
      const newSubscription = await this.prisma.subscription.update({
        where: {userId: appUserId},
        data: {
          canceledAt: new Date()
        }
      })
      res.json(newSubscription)
    }
  }

  getAvailablePlans = async (req: Request, res: Response) => {
    const plans = await this.prisma.availablePlan.findMany()
    res.json(plans)
  }
}