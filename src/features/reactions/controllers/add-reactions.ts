import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import HTTP_STATUS from 'http-status-codes';

import { joiValidation } from '@global/decorators/joi-validation-decorators';
import { addReactionSchema } from '@reaction/schemes/reaction';
import { IReactionDocument } from '@reaction/interfaces/reaction.interface';
import { ReactionCache } from '@service/redis/reaction.cache';

const reactionCache: ReactionCache = new ReactionCache();

export class AddReaction {
  @joiValidation(addReactionSchema)
  public async reaction(req: Request, res: Response): Promise<void> {
    const { _userTo, postId, type, previousReaction, postReaction, profilePicture } = req.body;
    const reactionObject: IReactionDocument = {
      _id: new ObjectId(),
      postId,
      type,
      avataColor: req.currentUser!.avatarColor,
      username: req.currentUser!.username,
      profilePicture
    } as IReactionDocument;

    await reactionCache.savePostReactionToCache(postId, reactionObject, postReaction, type, previousReaction);

    res.status(HTTP_STATUS.OK).json({ message: 'reaction added successfully' });
  };
};
