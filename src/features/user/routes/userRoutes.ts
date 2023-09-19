import express, { Router } from 'express';

import { authMiddleware } from '@global/helpers/auth-middleware';
import { GetProfile } from '@user/controllers/get-profile';
import { SerchUser } from '@user/controllers/search-user';
import { UpdatePassword } from '@user/controllers/change-password';
import { UpdateInfo } from '@user/controllers/update-basic-info';
import { Setting } from '@user/controllers/update-setting';



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

    this.router.put('/user/profile/change-password', authMiddleware.checkAuthentication, UpdatePassword.prototype.password);
    this.router.put('/user/profile/basic-info', authMiddleware.checkAuthentication, UpdateInfo.prototype.info);
    this.router.put('/user/profile/social-links', authMiddleware.checkAuthentication, UpdateInfo.prototype.social);
    this.router.put('/user/profile/settings', authMiddleware.checkAuthentication, Setting.prototype.updateNotificationSetting);

    return this.router;
  };
};

export const userRoutes: UserRoutes = new UserRoutes();
