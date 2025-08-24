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

  updateUserFavoriteServiceProvider = async (req: Request, res: Response) => {
    const {userId, serviceProviderId, isFavorite} = req.body
    console.log(req.body)
    const userFavoriteServiceProvider = await this.prisma.favoriteServiceProvider.findFirst({
      where: {
        userId, serviceProviderId
      }
    })
    if (userFavoriteServiceProvider) {
      if (isFavorite) {
        await this.prisma.favoriteServiceProvider.update({
          where: {
            id: userFavoriteServiceProvider.id
          },
          data:{
            isDeleted: false,
            deletedAt: null
          }
        })
      } else {
        await this.prisma.favoriteServiceProvider.update({
          where: {
            id: userFavoriteServiceProvider.id
          },
          data:{
            isDeleted: true,
            deletedAt: new Date()
          }
        })
      }
    } else {
      await this.prisma.favoriteServiceProvider.create({
        data: {
          userId, serviceProviderId
        }
      })
    }

    res.json({message: "User favorite service provider list is updated"})
  }

  checkServiceProvider = async (req: Request, res: Response) => {
    const {id} = req.params
    const serviceProvider = await this.prisma.serviceProvider.findUnique({
      where: {id}
    })

    if (!serviceProvider) {
      res.status(404).json({error: "service provider can't be found"})
      return
    }
    res.json(serviceProvider)
  }

  checkFavoriteServiceProvider = async (req: Request, res: Response) => {
    const {userId, serviceProviderId} = req.params
    const favoriteServiceProvider = await this.prisma.favoriteServiceProvider.findFirst({
      where: {
        userId,
        serviceProviderId,
        isDeleted: false
      }
    })
    if (favoriteServiceProvider) {
      res.send(true)
    } else {
      res.send(false)
    }
  }
}