import {PrismaClient} from "@prisma/client";
import {CategoryController} from "@/controllers/CategoryController";
import {ChecklistController} from "@/controllers/ChecklistController";
import {DocumentController} from "@/controllers/DocumentController";
import {ServiceProviderController} from "@/controllers/ServiceProviderController";
import {LoginController} from "@/controllers/LoginController";
import {AuthMiddleware} from "@/middleware/AuthMiddleware";
import {UserProfileController} from "@/controllers/UserProfileController";
import {MembershipController} from "@/controllers/MembershipController";
import {Router} from "express";
import multer from "multer"
import path from "path";
// import {prisma} from "@/..";
// import {authMiddleware, categoryController, checklistController, documentController, loginController, membershipController, serviceProviderController, upload, userProfileController} from "@/..";

export const prisma = new PrismaClient();

export const categoryController = new CategoryController(prisma);
export const checklistController = new ChecklistController(prisma)
export const documentController = new DocumentController(prisma)
export const serviceProviderController = new ServiceProviderController(prisma);
export const loginController = new LoginController(prisma)
export const userProfileController = new UserProfileController(prisma)
export const membershipController = new MembershipController(prisma)

export const authMiddleware = new AuthMiddleware()

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (req.path.startsWith("/api/documents/encrypted/document")) {
      // Store files for encrypted routes
      // NOTE: __dirname get the path of the root in project level instead of whole filesystem level
      callback(null, path.resolve(__dirname, "../encrypted/uploads/documents"));
    } else {
      callback(null, path.resolve(__dirname, "../uploads"))
    }
  },
  filename: (req, file, callback) => {
    callback(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split("/")[1]}`)
  }
})
export const upload = multer({storage})

export const routes = Router();

routes.get("/categories", categoryController.getCategories);
routes.get("/category/:id", categoryController.checkCategory);

routes.post("/checklists", checklistController.getChecklistByCategoryId)
routes.put("/checklists/category/:categoryId",  authMiddleware.verifyJsonWebToken, checklistController.updateChecklistCompletedState)
// routes.post("/checklists/search", checklistController.searchCategoryAndChecklist)

routes.post("/documents", authMiddleware.verifyJsonWebToken, documentController.getDocuments)

routes.get("/serviceproviders", serviceProviderController.getServiceProviders)
routes.put("/serviceproviders/favorite", authMiddleware.verifyJsonWebToken, serviceProviderController.updateUserFavoriteServiceProvider)
routes.get("/serviceprovider/:id", serviceProviderController.checkServiceProvider)
routes.get("/serviceprovider/favorite/:userId/:serviceProviderId", serviceProviderController.checkFavoriteServiceProvider)

routes.post("/users/login", loginController.login)
routes.get("/users/current/user", authMiddleware.verifyJsonWebToken, loginController.currentUser)

// routes.get("/users/logout", loginController.currentUser)
routes.post("/users/register", loginController.register)
routes.post("/users/forget/password", loginController.forgetPassword)
routes.post("/users/reset/password", loginController.resetPassword)
routes.post("/users/login/google", loginController.googleLogin)

routes.get("/users/info/user/:id", authMiddleware.verifyJsonWebToken, userProfileController.getUserInformation)
routes.put("/users/info/user/:id", authMiddleware.verifyJsonWebToken, userProfileController.updateUserInformation)
// check user exist for deleting that user account
routes.post("/users/check/user/:id", authMiddleware.verifyJsonWebToken, userProfileController.checkUser)
routes.put("/users/change/password/user/:id", authMiddleware.verifyJsonWebToken, userProfileController.changePassword)

routes.put("/users/info/avatar/user", authMiddleware.verifyJsonWebToken, upload.single("avatar"), userProfileController.updateUserAvatar)

routes.delete("/user/:id", userProfileController.deleteUser)

routes.get("/memberships/user/:id", authMiddleware.verifyJsonWebToken, membershipController.getMembership)
routes.put("/memberships/user", authMiddleware.verifyJsonWebToken, membershipController.updateMembership)
routes.delete("/memberships/user", authMiddleware.verifyJsonWebToken, membershipController.cancelSubscription)
routes.post("/memberships/stripe/setupintent/:id", authMiddleware.verifyJsonWebToken, membershipController.getCustomerAndSetupIntent)
routes.post("/memberships/stripe/subscription", authMiddleware.verifyJsonWebToken, membershipController.stripeSubscribe)

routes.get("/memberships/plans", membershipController.getAvailablePlans)