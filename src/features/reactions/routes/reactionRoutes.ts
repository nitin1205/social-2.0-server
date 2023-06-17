import { authMiddleware } from '@global/helpers/auth-middleware';
import { AddReaction } from '@reaction/controllers/add-reactions';
import { GetReaction } from '@reaction/controllers/get-reactions';
import { RemoveReaction } from '@reaction/controllers/remove-reactions';
import express, { Router } from 'express';


class ReactionRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  };

  public routes(): Router {
    this.router.post('/posts/reaction', authMiddleware.checkAuthentication, AddReaction.prototype.reaction);

    this.router.delete('/posts/reaction/:postId/:previousReaction/:postReactions', authMiddleware.checkAuthentication, RemoveReaction.prototype.remove);

    this.router.get('/posts/reactions/:postId/', authMiddleware.checkAuthentication, GetReaction.prototype.get);

    this.router.get('/posts/single/reaction/:postId/:username', authMiddleware.checkAuthentication, GetReaction.prototype.singleReactionByUsername);

    this.router.get('/posts/reactions/:username', authMiddleware.checkAuthentication, GetReaction.prototype.reactionsByUsername);

    return this.router;
  };
};

export const reactionRoutes: ReactionRoutes = new ReactionRoutes();
