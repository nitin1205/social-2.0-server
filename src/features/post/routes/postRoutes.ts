import express, { Router } from 'express';

import { authMiddleware } from '@global/helpers/auth-middleware';
import { CreatePost } from '@post/controllers/create.post';
import { GetPost } from '@post/controllers/get-post';
import { DeletePost } from '@post/controllers/delete-post';
import { UpdatePost } from '@post/controllers/update-post';

class PostRoutes{
  private router: Router;

  constructor() {
    this.router = express.Router();
  };

  public routes(): Router {
    this.router.get('/post/all/:page', authMiddleware.checkAuthentication, GetPost.prototype.posts);
    this.router.get('/post/images/:page', authMiddleware.checkAuthentication, GetPost.prototype.postsWithImages);
    this.router.get('/post/videos/:page', authMiddleware.checkAuthentication, GetPost.prototype.postsWithVideos);

    this.router.post('/post', authMiddleware.checkAuthentication, CreatePost.prototype.post);
    this.router.post('/post/image', authMiddleware.checkAuthentication, CreatePost.prototype.postWithImage);
    this.router.post('/post/video', authMiddleware.checkAuthentication, CreatePost.prototype.postWithVideo);

    this.router.put('/post:postId', authMiddleware.checkAuthentication, UpdatePost.prototype.update);
    this.router.put('/post/image/:postId', authMiddleware.checkAuthentication, UpdatePost.prototype.postWithImage);
    this.router.put('/post/video/:postId', authMiddleware.checkAuthentication, UpdatePost.prototype.postWithVideo);

    this.router.delete('/post/:postId', authMiddleware.checkAuthentication, DeletePost.prototype.post);

    return this.router;
  };
};

export const postRoutes: PostRoutes = new PostRoutes();
