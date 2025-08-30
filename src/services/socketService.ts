import {Request, Response} from "express"
import {io} from "@/..";

export const notifySubscriptionUpdated = (userId: string, data) => {
  // subscription-updated is the param for connection, not the message itself
 io.to(`user ${userId}`).emit("subscription-updated", data)
}