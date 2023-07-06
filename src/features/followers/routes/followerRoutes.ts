import express, { Router } from 'express';

import { authMiddleware } from '@global/helpers/auth-middleware';
import { AddFollower } from '@follower/controllers/follower-user';


class FollowerRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  };

  public routes(): Router {
    this.router.put('/user/follow/:followerId', authMiddleware.checkAuthentication, AddFollower.prototype.follower);
    return this.router;
  };
};

export const followerRoutes: FollowerRoutes = new FollowerRoutes();
