import express, { Router } from 'express';

import { authMiddleware } from '@global/helpers/auth-middleware';
import { Create } from '@post/controllers/create.post';
import { GetPost } from '@post/controllers/get-post';

class PostRoutes{
  private router: Router;

  constructor() {
    this.router = express.Router();
  };

  public routes(): Router {
    this.router.get('/post/all/:page', authMiddleware.checkAuthentication, GetPost.prototype.posts);
    this.router.get('/post/images/:page', authMiddleware.checkAuthentication, GetPost.prototype.postsWithImages);

    this.router.post('/post', authMiddleware.checkAuthentication, Create.prototype.post);
    this.router.post('/post/image', authMiddleware.checkAuthentication, Create.prototype.postWithImage);

    return this.router;
  };
};

export const postRoutes: PostRoutes = new PostRoutes();
