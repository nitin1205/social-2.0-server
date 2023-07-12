import express, { Router } from 'express';

import { authMiddleware } from '@global/helpers/auth-middleware';
import { AddFollower } from '@follower/controllers/follower-user';
import { RemoveUser } from '@follower/controllers/unfollow-user';


class FollowerRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  };

  public routes(): Router {
    this.router.put('/user/follow/:followerId', authMiddleware.checkAuthentication, AddFollower.prototype.follow);
    this.router.put('/user/unfollow/:followeeId/:followerId', authMiddleware.checkAuthentication, RemoveUser.prototype.unfollow);
    return this.router;
  };
};

export const followerRoutes: FollowerRoutes = new FollowerRoutes();
