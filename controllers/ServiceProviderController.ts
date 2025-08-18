import {PrismaClient} from "@prisma/client";
import {Request, Response} from "express"

export class ServiceProviderController {
  constructor(public prisma: PrismaClient) {}

  getServiceProviders = async (req: Request, res: Response) => {
    const serviceProviders = await this.prisma.serviceProvider.findMany({
      where: {
        isDeleted: false
      },
      orderBy: {
        name: "asc"
      }
    })
    res.json(serviceProviders)
  }
}