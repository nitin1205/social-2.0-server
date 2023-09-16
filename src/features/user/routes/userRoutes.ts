import express, { Router } from 'express';

import { authMiddleware } from '@global/helpers/auth-middleware';
import { GetProfile } from '@user/controllers/get-profile';
import { SerchUser } from '@user/controllers/search-user';



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
    this.router.get('/user/profile/search/:query', authMiddleware.checkAuthentication, SerchUser.prototype.user);

    return this.router;
  };
};

export const userRoutes: UserRoutes = new UserRoutes();
