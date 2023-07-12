import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ObjectId }  from 'mongodb';
import HTTPS_STATUS from 'http-status-codes';

import { FollowerCache } from '@service/redis/follower.cache';
import { UserCache } from '@service/redis/user.cache';
import { IUserDocument } from '@user/interfaces/user.interface';
import { IFollowerData } from '@follower/interfaces/follower.interface';
import { socketIOFollowerObject } from '@socket/follower';
import { followerQueue } from '@service/queues/follower.queue';

const followerCache: FollowerCache = new FollowerCache();
const userCache: UserCache = new UserCache();

export class AddFollower {
  public async follow(req: Request, res: Response): Promise<void> {
    const { followerId } = req.params;
    // update count in cache
    const followersCount: Promise<void> = followerCache.updateFollowersCountInCache(`${followerId}`, 'followersCount', 1);
    const followeeCount: Promise<void> = followerCache.updateFollowersCountInCache(`${req.currentUser!.userId}`, 'followingCount', 1);
    await Promise.all([followersCount, followeeCount]);

    const cacheFollower: Promise<IUserDocument> = userCache.getUserFromCache(followerId) as Promise<IUserDocument>;
    const cacheFollowee: Promise<IUserDocument> = userCache.getUserFromCache(`${req.currentUser!.userId}`) as Promise<IUserDocument>;
    const response: [IUserDocument, IUserDocument] = await Promise.all([cacheFollower, cacheFollowee]);

    const followerObjectId: ObjectId = new ObjectId();
    const addFolloweeData: IFollowerData = AddFollower.prototype.userData(response[0]);
    socketIOFollowerObject.emit('add follower', addFolloweeData);

    const addFollowerToCache: Promise<void> = followerCache.saveFollowerToCache(`followers:${req.currentUser!.userId}`, `${followerId}`);
    const addFolloweeToCache: Promise<void> = followerCache.saveFollowerToCache(`following:${followerId}`, `${req.currentUser!.userId}`);
    await Promise.all([addFollowerToCache, addFolloweeToCache]);

    followerQueue.addFollowerJob('addFollowerToDB', {
      keyOne: `${req.currentUser!.userId}`,
      keyTwo: `${followerId}`,
      username: req.currentUser!.username,
      followerDocumentId: followerObjectId
    });

    res.status(HTTPS_STATUS.OK).json({ messaghe: 'Following user now' });
  };

  private userData(user: IUserDocument): IFollowerData {
    return {
      _id: new mongoose.Types.ObjectId(user._id),
      username: user.username!,
      avatarColor: user.avatarColor!,
      postCount: user.postsCount!,
      followersCount: user.followersCount!,
      followingCount: user.followingCount!,
      profilePicture: user.profilePicture!,
      uId: user.uId!,
      userProfile: user
    };
  };

};
