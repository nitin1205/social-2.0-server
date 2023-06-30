import { Request, Response } from 'express';
import mongoose from 'mongoose';
import HTTPS_STATUS from 'http-status-codes';

import { addCommentSchema } from '@comment/schemes/comment';
import { joiValidation } from '@global/decorators/joi-validation-decorators';
import { ICommentDocument, ICommentNameList } from '@comment/interfaces/comment.interface';
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

    res.status(HTTPS_STATUS.OK).json({ message: 'Post comment', comments });
  };

  public async commentsNamesFromCache(req: Request, res: Response): Promise<void> {
    const { postId } = req.params;
    const cachedComments: ICommentNameList[] = await commentCache.getCommentSNamesFromCache(postId);
    const commentsNames : ICommentNameList[] = cachedComments.length
      ? cachedComments
      : await commentService.getPostCommentNames({ postId: new mongoose.Types.ObjectId(postId) }, { createdAt: -1 });

    res.status(HTTPS_STATUS.OK).json({ message: 'Post comments names', commentsNames });
  };

  public async Singlecomment(req: Request, res: Response): Promise<void> {
    const { postId, commentId } = req.params;
    const cachedComments: ICommentDocument[] = await commentCache.getSingleCommentsFromCache(postId, commentId);
    const comment : ICommentDocument[] = cachedComments.length
      ? cachedComments
      : await commentService.getPostComments({ postId: new mongoose.Types.ObjectId(commentId) }, { createdAt: -1 });

    res.status(HTTPS_STATUS.OK).json({ message: 'Single post comments', Singlecomment: comment[0] });
  };
};
