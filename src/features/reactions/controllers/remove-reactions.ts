import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

import { ReactionCache } from '@service/redis/reaction.cache';
import { IReactionJob } from '@reaction/interfaces/reaction.interface';
import { reactionQueue } from '@service/queues/reaction.queue';

const reactionCache: ReactionCache = new ReactionCache();

export class RemoveReaction {
  public async remove(req: Request, res: Response): Promise<void> {
    const {postId, previousReaction, postReaction } = req.params;

    await reactionCache.removePostReactionFromCache(postId, `${req.currentUser!.username}` ,JSON.parse(postReaction));

    const databaseReactionData: IReactionJob = {
      postId,
      username: req.currentUser!.username,
      previousReaction,
    };
    reactionQueue.addReactionJob('removeReactionFromDB', databaseReactionData);
    res.status(HTTP_STATUS.OK).json({ message: 'reaction removed successfully' });
  };
};
