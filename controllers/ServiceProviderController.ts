import {PrismaClient} from "@prisma/client";

export class ServiceProviderController {
  constructor(public prisma: PrismaClient) {}
}