import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import mongoose from 'mongoose';

import { FollowerCache } from '@service/redis/follower.cache';
import { PostCache } from '@service/redis/post.cache';
import { UserCache } from '@service/redis/user.cache';
import { IAllUsers, IUserDocument } from '@user/interfaces/user.interface';
import { userService } from '@service/db/user.service';
import { IFollowerData } from '@follower/interfaces/follower.interface';
import { followerService } from '@service/db/follower.service';

const postCache: PostCache = new PostCache();
const userCache: UserCache = new UserCache();
const followercache: FollowerCache = new FollowerCache();

const PAGE_SIZE = 12;

interface IUserAll {
  newSkip: number;
  limit: number;
  skip: number;
  userId: string
};


export class GetProfile {
  public  async all(req: Request, res: Response): Promise<void> {
    const { page } = req.params;
    const skip: number = (parseInt(page) -1) * PAGE_SIZE;
    const limit: number = PAGE_SIZE * parseInt(page);
    const newSkip: number = skip === 0 ? skip : skip +1;

    const allUsers = await GetProfile.prototype.allUsers ({
      newSkip,
      limit,
      skip,
      userId: `${ req.currentUser!.userId }`
    });

    const followers: IFollowerData[] = await GetProfile.prototype.followers(`${req.currentUser!.userId}`);

    res.status(HTTP_STATUS.OK).json({ message: 'Profiles succefully fetched.', users: allUsers.totalUsers, totalUsers: allUsers.totalUsers, followers });
  };

  private async allUsers({ newSkip, limit, skip, userId }: IUserAll): Promise<IAllUsers> {
    let users;
    let type = '';
    const cachedUsers: IUserDocument[] = await userCache.getUsersFromCache(newSkip, limit, userId) as IUserDocument[];
    if(cachedUsers.length) {
      type = 'redis';
      users = cachedUsers;
    } else {
      type = 'mongodb';
      users = await userService.getAllUsers(userId, skip, limit);
    };

    const totalUsers: number = await GetProfile.prototype.usersCount(type);
    return { users, totalUsers };
   };

  private async usersCount(type: string): Promise<number> {
    return 0;
  };

  private async followers(userId: string): Promise<IFollowerData[]> {
    const cachedFollowers: IFollowerData[] = await followercache.getFollowersFromCache(`followers:${userId}`);
    const result = cachedFollowers.length ? cachedFollowers : await followerService.getFolloweeData(new mongoose.Types.ObjectId(userId));
    return result;
  };
};
