import express, { Router } from 'express';

import { authMiddleware } from '@global/helpers/auth-middleware';
import { AddFollower } from '@follower/controllers/follower-user';
import { RemoveUser } from '@follower/controllers/unfollow-user';
import { GetFollower } from '@follower/controllers/get-followers';
import { AddUser } from '@follower/controllers/block-user';


class FollowerRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  };

  public routes(): Router {
    this.router.get('/user/following', authMiddleware.checkAuthentication, GetFollower.prototype.userFollowing);
    this.router.get('/user/followers/:userId', authMiddleware.checkAuthentication, GetFollower.prototype.userFollowers);

    this.router.put('/user/follow/:followerId', authMiddleware.checkAuthentication, AddFollower.prototype.follow);
    this.router.put('/user/unfollow/:followeeId/:followerId', authMiddleware.checkAuthentication, RemoveUser.prototype.unfollow);
    this.router.put('/user/block/:followerId', authMiddleware.checkAuthentication, AddUser.prototype.block);
    this.router.put('/user/unblock/:followerId', authMiddleware.checkAuthentication, AddUser.prototype.unblock);
    return this.router;
  };
};

export const followerRoutes: FollowerRoutes = new FollowerRoutes();
