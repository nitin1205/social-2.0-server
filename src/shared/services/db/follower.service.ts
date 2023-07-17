import mongoose, { Query } from 'mongoose';
import { ObjectId, BulkWriteResult } from 'mongodb';

import { IFollowerData, IFollowerDocument } from '@follower/interfaces/follower.interface';
import { FollowerModel } from '@follower/models/follower.schema';
import { IQueryComplete, IQueryDeleted } from '@post/interfaces/post.interface';
import { UserModel } from '@user/models/user.schema';

class FollowerService {
  public async addFollowerToDB(userId: string, followeeId: string, username: string, followerDocumentId: ObjectId): Promise<void> {
    const followeeObjectId: ObjectId = new mongoose.Types.ObjectId(followeeId);
    const followerObjectId: ObjectId = new mongoose.Types.ObjectId(userId);

    await FollowerModel.create({
      _id: followerDocumentId,
      followeeId: followeeObjectId,
      followerId: followerObjectId
    });

    const users: Promise<BulkWriteResult> = UserModel.bulkWrite([
      {
        updateOne: {
          filter: { _id: userId },
          update: { $inc: { followingCount: 1 }}
          }
        },
        {
          updateOne: {
            filter: { _id: followeeId },
            update: { $inc: { followersCount: 1 }}
          }
        }
    ]);

    await Promise.all([users, UserModel.findOne({ _id: followeeId })]);
  };

  public async removeFollowerFromDB(followeeId: string, followerId: string): Promise<void> {
    const followeeObjectId: ObjectId = new mongoose.Types.ObjectId(followeeId);
    const followerObjectId: ObjectId = new mongoose.Types.ObjectId(followerId);

    const unfollow: Query<IQueryComplete & IQueryDeleted, IFollowerDocument> = FollowerModel.deleteOne({
      followeeId: followeeObjectId,
      followerId: followerObjectId
    });

    const users: Promise<BulkWriteResult> = UserModel.bulkWrite([
      {
        updateOne: {
          filter: { _id: followerId },
          update: { $inc: { followingCount: -1 }}
          }
        },
        {
          updateOne: {
            filter: { _id: followeeId },
            update: { $inc: { followersCount: -1 }}
          }
        }
    ]);

    await Promise.all([unfollow, users]);
  };

  public async getFolloweeData(userObjectId: ObjectId): Promise<IFollowerData[]> {
    const followee: IFollowerData[] = await FollowerModel.aggregate([
      { $match: { followerId: userObjectId } },
      { $lookup: { from: 'User', localField: 'followeeId', foreignField: '_id', as: 'followeeId' } },
      { $unwind: '$followeeId' },
      { $lookup: { from: 'Auth', localField: 'followeeId.authId', foreignField: '_id', as: 'authId' } },
      { $unwind: '$authId' },
      {
        $addFields: {
          _id: '$followeeId._id',
          username: '$authId.username',
          avatarColor: '$authId.avatarColor',
          uId: '$authId.uid',
          postCount: '$followeeId.postCount',
          followersCount: '$followeeId.followersCount',
          followingCount: '$followeeId.followingCount',
          profilePicture: '$followeeId.profilePicture',
          userProfile: '$followeeId'
        }
      },
      {
        $project: {
          authId: 0,
          followerId: 0,
          followeeId: 0,
          createdAt: 0,
          _v: 0
        }
      }
    ]);
    return followee;
  };

  public async getFollowerData(userObjectId: ObjectId): Promise<IFollowerData[]> {
    const follower: IFollowerData[] = await FollowerModel.aggregate([
      { $match: { followeeId: userObjectId } },
      { $lookup: { from: 'User', localField: 'followerId', foreignField: '_id', as: 'followerId' } },
      { $unwind: '$followerId' },
      { $lookup: { from: 'Auth', localField: 'followerId.authId', foreignField: '_id', as: 'authId' } },
      { $unwind: '$authId' },
      {
        $addFields: {
          _id: '$followerId._id',
          username: '$authId.username',
          avatarColor: '$authId.avatarColor',
          uId: '$authId.uid',
          postCount: '$followerId.postCount',
          followingCount: '$followerId.followingCount',
          followersCount: '$followerId.followersCount',
          profilePicture: '$followerId.profilePicture',
          userProfile: '$followerId'
        }
      },
      {
        $project: {
          authId: 0,
          followerId: 0,
          followeeId: 0,
          createdAt: 0,
          _v: 0
        }
      }
    ]);
    return follower;
  };
};

export const followerService: FollowerService = new FollowerService();
