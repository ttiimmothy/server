import {uuidSchema} from "@/lib/zodSchema";
import {PrismaClient, User} from "@prisma/client";
import bcrypt from "bcryptjs";
import {Request, Response} from "express"

export class UserProfileController {
  constructor (public prisma: PrismaClient) {}

  getUserInformation = async (req: Request, res: Response) => {
    const {id: userId} = req.params

    if (!userId) {
      res.status(400).json({error: "There is no user id"})
      return
    }
    if (!uuidSchema.safeParse(userId)) {
      res.status(400).json({error: "Invalid user id format. It should be uuid"})
      return
    }

    const user = await this.prisma.user.findUnique({
      where: {id: userId}
    })

    if (!user) {
      // NOTE: 404: can't find the resources/data
      res.status(404).json({error: "There is no this user profile"})
      return
    }
    if (user.isDeleted) {
      res.status(400).json({error: "This user is deactivated"})
      return
    }

    // omit security credential (password)
    const {password, ...userInfo} = user

    res.json(userInfo)
  }

  updateUserInformation = async (req: Request, res: Response) => {
    const {id: userId} = req.params

    if (!userId) {
      res.status(400).json({error: "There is no user id"})
      return
    }
    if (!uuidSchema.safeParse(userId)) {
      res.status(400).json({error: "Invalid user id format. It should be uuid"})
      return
    }
    if (!req.body) {
      res.status(400).json({error: "There is no user information for update"})
      return
    }

    const user = await this.prisma.user.update({
      where: {id: userId},
      data: req.body
    })

    const {password, ...userInfo} = user

    res.json(userInfo)
  }

  checkUser = async (req: Request, res: Response) => {
    const {id: userId} = req.params
    const {email} = req.body

    if (!userId) {
      res.status(400).json({error: "There is no user id"})
      return
    }
    if (!uuidSchema.safeParse(userId)) {
      res.status(400).json({error: "Invalid user id format. It should be uuid"})
      return
    }
    if (!email) {
      res.status(400).json({error: "email is missing"})
      return
    }

    const user = await this.prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      res.status(404).json({error: "There is no this user"})
      return
    }
    if (user.isDeleted) {
      res.status(400).json({error: "This user is deactivated"})
      return
    }

    res.json({message: "User exists"})
  }

  changePassword = async (req: Request, res: Response) => {
    const {id} = req.params
    const {newPassword} = req.body

    if (!id) {
      res.status(400).json({error: "There is no user id"})
      return
    }
    if (!uuidSchema.safeParse(id)) {
      res.status(400).json({error: "Invalid user id format. It should be uuid"})
      return
    }

    const user = await this.prisma.user.findUnique({
      where: {id}
    })

    if (!user) {
      res.status(404).json({error: "There is no this user"})
      return
    }
    if (user.isDeleted) {
      res.status(400).json({error: "This user is deactivated"})
      return
    }
    if (!newPassword) {
      res.status(400).json({error: "There is no password for update"})
      return
    }

    const hashPassword = await bcrypt.hash(newPassword, 10)
    await this.prisma.user.update({
      where: {id},
      data: { password: hashPassword }
    })

    res.json({message: "password update success"})
  }

  deleteUser = async (req: Request, res: Response) => {
    const {id} = req.params
    await this.prisma.user.update({
      where: {id},
      data: {
        isDeleted: true,
        accountStatus: {isActive: false},
        deletedAt: new Date()
      }
    })
    res.json({message: "The user is deactivated"})
  }

  updateUserAvatar = async (req: Request & {user: Omit<User, "password">}, res: Response) => {
    // multer helps store the file in req.file, multipart/form-data Parsing by multer
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return
    }
    const user = await this.prisma.user.update({
      where: {id: req.user.id},
      data: {
        photoURL: req.file.filename
      }
    })
    res.json(user)
  }
}