import { authMiddleware } from '@global/helpers/auth-middleware';
import { AddReaction } from '@reaction/controllers/add-reactions';
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

    return this.router;
  };
};

export const reactionRoutes: ReactionRoutes = new ReactionRoutes();
