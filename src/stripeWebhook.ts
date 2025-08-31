import {prisma} from "@/routes";
import {Request, Response} from "express"
import {io, stripe} from "@/..";

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
      // const subscriptionId = invoice.parent.subscription_details.subscription;
      // const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      //   // expand: ['latest_invoice.payment_intent', 'items.data.price.product'],
      //   expand: ['latest_invoice'],
      // });
      // const periodStart = new Date((invoice.lines.data[0]?.period?.start ?? 0) * 1000)
      // const periodEnd = invoice.lines.data[0]?.period?.end; // unix ts
      // const periodEnd = new Date((invoice.lines.data[0]?.period?.end ?? 0) * 1000)
      
      // const subscriptionItem = subscription.items.data[0];
      // const periodStart = new Date(subscriptionItem.current_period_start * 1000);
      // const periodEnd = new Date(subscriptionItem.current_period_end * 1000);
      // const status = {
      //   "incomplete": false,
      //   "incomplete_expired": false,
      //   "trialing": false,
      //   "active": true,
      //   "past_due": false,
      //   "canceled": false,
      //   "unpaid": false
      // }
      // await prisma.subscription.upsert({
      //   where: {
      //     userId: subscription.metadata.userId
      //   },
      //   update: {
      //     plan: subscription.metadata.planId,
      //     status: subscription.status,
      //     activeStatus: status[subscription.status],
      //     startDate: periodStart,
      //     endDate: subscription.ended_at ? new Date(subscription.ended_at * 1000) : periodEnd,
      //     canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null, 
      //     stripeSubscriptionId: subscription.id,
      //     stripePriceId: subscription.items.data[0]?.price?.id,
      //   },
      //   create: {
      //     plan: subscription.metadata.planId,
      //     status: subscription.status,
      //     activeStatus: status[subscription.status],
      //     startDate: periodStart,
      //     endDate: subscription.ended_at ? new Date(subscription.ended_at * 1000) : periodEnd,
      //     stripeSubscriptionId: subscription.id,
      //     stripePriceId: subscription.items.data[0]?.price?.id,
      //     userId: subscription.metadata.userId
      //   }
      // })

      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object;
      // TODO: flag payment issue, email user to update card
      break;
    }
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object
      const subscriptionItem = subscription.items.data[0];
      const periodStart = new Date(subscriptionItem.current_period_start * 1000);
      const periodEnd = new Date(subscriptionItem.current_period_end * 1000);
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
          endDate: subscription.ended_at ? new Date(subscription.ended_at * 1000) : periodEnd,
          canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null, 
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0]?.price?.id,
        },
        create: {
          plan: subscription.metadata.planId,
          status: subscription.status,
          activeStatus: status[subscription.status],
          startDate: periodStart,
          endDate: subscription.ended_at ? new Date(subscription.ended_at * 1000) : periodEnd,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0]?.price?.id,
          userId: subscription.metadata.userId
        }
      })

      io.to(`user ${subscription.metadata.userId}`).emit("subscription-updated", {
        type: 'subscription-updated',
        status: 'active'
      })
      break;
    }
  }
  res.json({ received: true });
}