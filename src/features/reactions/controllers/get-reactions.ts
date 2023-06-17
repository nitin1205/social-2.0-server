import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';
import mongoose from 'mongoose';

import { ReactionCache } from '@service/redis/reaction.cache';
import { IReactionDocument } from '@reaction/interfaces/reaction.interface';
import { reactionService } from '@service/db/reaction.service';

const reactionCache: ReactionCache = new ReactionCache();

export class GetReaction {
  public async get(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    const cachedReactions: [IReactionDocument[], number] = await reactionCache.getReactionsFromCache(postId);
    const reactions: [IReactionDocument[], number] = cachedReactions[0].length ? cachedReactions :
    await reactionService.getPostReactions({ postId: new mongoose.Types.ObjectId(postId) }, { createdAt: -1 });
    res.status(HTTP_STATUS.OK).json({ message: 'Post reactions', reactions: reactions[0], count: reactions[1] });
  };

  public async singleReactionByUsername(req: Request, res: Response): Promise<void> {
    const { postId, username } = req.params;
    const cachedReaction: [IReactionDocument, number] | [] = await reactionCache.getSingleReactionByUsernameFromCache(postId, username);
    const reactions: [IReactionDocument, number] | [] = cachedReaction.length ? cachedReaction : await reactionService.getSinglePostReactionByUsername(postId, username);
    res.status(HTTP_STATUS.OK).json({ message: 'Single post reaction by username', reactions: reactions.length ? reactions[0] : {}, count: reactions.length ? reactions[1] : 0 });
  };

  public async reactionsByUsername(req: Request, res: Response): Promise<void> {
    const { username } = req.params;
    const reactions:IReactionDocument[] = await reactionService.getReactionsByUsername(username);
    res.status(HTTP_STATUS.OK).json({ message: 'post reactions by username', reactions });
  };
};
