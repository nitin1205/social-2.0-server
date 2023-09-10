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

    return this.router;
  };
};

export const userRoutes: UserRoutes = new UserRoutes();
