import { Request, Response } from 'express';
import HTTPS_STATUS from 'http-status-codes';

import { followerQueue } from '@service/queues/follower.queue';
import { FollowerCache } from '@service/redis/follower.cache';

const followerCache: FollowerCache = new FollowerCache();

export class RemoveUser {
  public async unfollow(req: Request, res: Response): Promise<void> {
    const { followeeId, followerId } = req.params;

    const removeFollowerFromCache: Promise<void> = followerCache.removeFollowerFromCache(`followers:${req.currentUser!.userId}`, followeeId);
    const removeFolloweeFromCache: Promise<void> = followerCache.removeFollowerFromCache(`following:${followerId}`, followerId);

    const followersCount: Promise<void> = followerCache.updateFollowersCountInCache(`${followeeId}`, 'followersCount', -1);
    const followeeCount: Promise<void> = followerCache.updateFollowersCountInCache(`${followerId}`, 'followingCount', -1);
    await Promise.all([removeFolloweeFromCache, removeFollowerFromCache, followeeCount, followersCount]);

    followerQueue.addFollowerJob('removeFollowerFromDB', {
      keyOne: `${followeeId}`,
      keyTwo: `${followerId}`,
    });
    res.status(HTTPS_STATUS.OK).json({ message: 'Unfollowed the user' });
  };
};
