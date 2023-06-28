import { Request, Response } from 'express';
import mongoose from 'mongoose';
import HTTPS_STATUS from 'http-status-codes';

import { addCommentSchema } from '@comment/schemes/comment';
import { joiValidation } from '@global/decorators/joi-validation-decorators';
import { ICommentDocument } from '@comment/interfaces/comment.interface';
import { CommentCache } from '@service/redis/comment.cache';
import { commentService } from '@service/db/comment.service';

const commentCache: CommentCache = new CommentCache();

export class GetComments {
  @joiValidation(addCommentSchema)
  public async get(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    const cachedComments: ICommentDocument[] = await commentCache.getPostCommentsFromCache(postId);
    const comments: ICommentDocument[] = cachedComments.length
      ? cachedComments
      : await commentService.getPostComments({ postId: new mongoose.Types.ObjectId(postId) }, { createdAt: -1 });

    res.status(HTTPS_STATUS.OK).json({ message: 'comment'});
  };
};
