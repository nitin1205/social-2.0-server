import { authMiddleware } from '@global/helpers/auth-middleware';
import { GetProfile } from '@user/controllers/get-profile';
import express, { Router } from 'express';



class UserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  };

  public routes(): Router {
    this.router.get('/user/all/:page', authMiddleware.checkAuthentication, GetProfile.prototype.all);
    this.router.get('/user/profile', authMiddleware.checkAuthentication, GetProfile.prototype.profile);
    this.router.get('/user/profile/:userId', authMiddleware.checkAuthentication, GetProfile.prototype.getProfileByUserId);
    this.router.get('/user/profile/posts/:username/:userId/:uId', authMiddleware.checkAuthentication, GetProfile.prototype.profileAndPosts);
    this.router.get('/user/profile/user/suggestions', authMiddleware.checkAuthentication, GetProfile.prototype.randomUserSuggestions);

    return this.router;
  };
};

export const userRoutes: UserRoutes = new UserRoutes();
