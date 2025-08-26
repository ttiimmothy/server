import {prisma} from "@/router/routes";
import {Request, Response} from "express"
import {stripe} from "../..";

export const webhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]
  let event
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (e) {
    console.error("Webhook signature verification failed.", e.message);
    res.status(400).send(`Webhook Error: ${e.message}`);
    return
  }

  switch (event.type) {
    case "setup_intent.succeeded": {
      // const setupIntent = event.data.object

      break
    }
    case "invoice.payment_succeeded": {
      // mark user active through periodEnd
      // perform this in customer.subscription.updated
      // const invoice = event.data.object;
      // const subscriptionId = invoice.subscription;
      // const subscription = await stripe.subscriptions.retrieve(subscriptionId);

      // const periodStart = new Date((invoice.lines.data[0]?.period?.start ?? 0) * 1000)
      // const periodEnd = invoice.lines.data[0]?.period?.end; // unix ts
      // const periodEnd = new Date((invoice.lines.data[0]?.period?.end ?? 0) * 1000)
      
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      // TODO: flag payment issue, email user to update card
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      // TODO: sync subscription status in DB (active, past_due, canceled, etc.)
      const subscription = event.data.object
      const periodStart = new Date((subscription.items.data[0]?.period?.start ?? 0) * 1000)
      // const periodEnd = invoice.lines.data[0]?.period?.end; // unix ts
      const periodEnd = new Date((subscription.items.data[0]?.period?.end ?? 0) * 1000)
      const status = {
        "incomplete": false,
        "incomplete_expired": false,
        "trialing": false,
        "active": true,
        "past_due": false,
        "canceled": false,
        "unpaid": false
      }
      await prisma.subscription.upsert({
        where: {
          userId: subscription.metadata.userId
        },
        update: {
          plan: subscription.metadata.planId,
          status: subscription.status,
          activeStatus: status[subscription.status],
          startDate: periodStart,
          endDate: periodEnd,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0]?.price?.id,
        },
        create: {
          plan: subscription.metadata.planId,
          status: subscription.status,
          activeStatus: status[subscription.status],
          startDate: periodStart,
          endDate: periodEnd,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0]?.price?.id,
          userId: subscription.metadata.userId
        }
      })
      break;
    }
  }
  res.json({ received: true });
}