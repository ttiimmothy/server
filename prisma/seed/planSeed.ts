import {PrismaClient} from "@prisma/client";
import dotenv from "dotenv"

dotenv.config()
const prisma = new PrismaClient

export const planSeed = async () => {
  const planMonthly = await prisma.availablePlan.upsert({
    where: {planId: 'plan_monthly'},
    update: {},
    create: {
      planId: 'plan_monthly',
      name: 'Monthly Subscription',
      description: 'Access to all features on a monthly basis.',
      durationMonths: 1,
      price: 10,
      features: ['Full access to all categories', 'Unlimited checklist items', 'Priority support'],
      isTrial: false,
      stripePriceId: process.env.STRIPE_PLAN_MONTHLY_PRICE_ID
    },
  })

  const planAnnual = await prisma.availablePlan.upsert({
    where: {planId: 'plan_annual'},
    update: {},
    create: {
      planId: 'plan_annual',
      name: 'Annual Subscription',
      description: 'Save money with a yearly commitment.',
      durationMonths: 12,
      price: 100,
      features: ['Full access to all categories', 'Unlimited checklist items', 'Priority support', 'Early access to new features'],
      isTrial: false,
      stripePriceId: process.env.STRIPE_PLAN_ANNUAL_PRICE_ID
    }
  })

  await prisma.availablePlan.upsert({
    where: {planId: 'plan_trial'},
    update: {},
    create: {
      planId: 'plan_trial',
      name: '7-Day Free Trial',
      description: 'Try all premium features for 7 days.',
      durationMonths: 0.25, 
      price: 0,
      features: ['Full access to all categories for 7 days', 'Unlimited checklist items for 7 days'],
      isTrial: true,
    }
  })

  await prisma.availablePlan.upsert({
    where: {planId: 'plan_trial'},
    update: {},
    create: {
      planId: 'plan_trial',
      name: '7-Day Free Trial',
      description: 'Try all premium features for 7 days.',
      durationMonths: 0.25, 
      price: 0,
      features: ['Full access to all categories for 7 days', 'Unlimited checklist items for 7 days'],
      isTrial: true,
    }
  })

  await prisma.availablePlan.upsert({
    where: {planId: 'free'},
    update: {},
    create: {
      planId: 'free', // Default free plan as per subscriptionStore
      name: 'Free Plan',
      description: 'Basic access to the app.',
      durationMonths: Infinity,
      price: 0,
      features: ['Limited categories', 'Basic support'],
      isTrial: false,
    }
  })

  console.log(planMonthly, planAnnual)
}