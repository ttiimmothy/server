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
import {upload} from "./multer";

export const prisma = new PrismaClient();

export const categoryController = new CategoryController(prisma);
export const checklistController = new ChecklistController(prisma)
export const documentController = new DocumentController(prisma)
export const serviceProviderController = new ServiceProviderController(prisma);
export const loginController = new LoginController(prisma)
export const userProfileController = new UserProfileController(prisma)
export const membershipController = new MembershipController(prisma)

export const authMiddleware = new AuthMiddleware()

export const routes = Router();

routes.get("/categories", categoryController.getCategories);
routes.get("/category/:id", categoryController.checkCategory);

routes.post("/checklists", checklistController.getChecklistByCategoryId)
routes.put("/checklists/category/:categoryId",  authMiddleware.authenticate, checklistController.updateChecklistCompletedState)
// routes.post("/checklists/search", checklistController.searchCategoryAndChecklist)

routes.post("/documents", authMiddleware.authenticate, documentController.getDocuments)

routes.get("/serviceproviders", serviceProviderController.getServiceProviders)
routes.put("/serviceproviders/favorite", authMiddleware.authenticate, serviceProviderController.updateUserFavoriteServiceProvider)
routes.get("/serviceprovider/:id", serviceProviderController.checkServiceProvider)
routes.get("/serviceprovider/favorite/:userId/:serviceProviderId", serviceProviderController.checkFavoriteServiceProvider)

routes.post("/users/login", loginController.login)
routes.get("/users/current/user", authMiddleware.authenticate, loginController.currentUser)

// routes.get("/users/logout", loginController.currentUser)
routes.post("/users/register", loginController.register)
routes.post("/users/forget/password", loginController.forgetPassword)
routes.post("/users/reset/password", loginController.resetPassword)
routes.post("/users/login/google", loginController.googleLogin)

routes.get("/users/info/user/:id", authMiddleware.authenticate, userProfileController.getUserInformation)
routes.put("/users/info/user/:id", authMiddleware.authenticate, userProfileController.updateUserInformation)
// check user exist for deleting that user account
routes.post("/users/check/user/:id", authMiddleware.authenticate, userProfileController.checkUser)
routes.put("/users/change/password/user/:id", authMiddleware.authenticate, userProfileController.changePassword)

routes.put("/users/info/avatar/user", authMiddleware.authenticate, upload.single("avatar"), userProfileController.updateUserAvatar)

routes.delete("/user/:id", userProfileController.deleteUser)

routes.get("/memberships/user/:id", authMiddleware.authenticate, membershipController.getMembership)
routes.put("/memberships/user", authMiddleware.authenticate, membershipController.updateMembership)
routes.delete("/memberships/user", authMiddleware.authenticate, membershipController.cancelSubscription)
routes.post("/memberships/stripe/setupintent/:id", authMiddleware.authenticate, membershipController.getCustomerAndSetupIntent)
routes.post("/memberships/stripe/subscription", authMiddleware.authenticate, membershipController.stripeSubscribe)

routes.get("/memberships/plans", membershipController.getAvailablePlans)