import express, { Router } from 'express';

import { authMiddleware } from '@global/helpers/auth-middleware';
import { GetComments } from '@comment/controllers/get-comment';
import { AddComment } from '@comment/controllers/add-comment';

class CommentRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  };

  public routes(): Router {
    this.router.get('/post/comments/:postId', authMiddleware.checkAuthentication, GetComments.prototype.get);
    this.router.get('/post/commentsnames/:postId', authMiddleware.checkAuthentication, GetComments.prototype.commentsNamesFromCache);
    this.router.get('/post/single/comment/:postId/:commentId', authMiddleware.checkAuthentication, GetComments.prototype.Singlecomment);

    this.router.post('/post/commnet', authMiddleware.checkAuthentication, AddComment.prototype.addComments);
    return this.router;
  };
};

export const commnetRoutes: CommentRoutes = new CommentRoutes();
