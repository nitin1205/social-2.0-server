import { authMiddleware } from '@global/helpers/auth-middleware';
import { AddReaction } from '@reaction/controllers/add-reactions';
import express, { Router } from 'express';


class ReactionRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  };

  public routes(): Router {
    this.router.post('/posts/reaction', authMiddleware.checkAuthentication, AddReaction.prototype.reaction);

    return this.router;
  };
};

export const reactionRoutes: ReactionRoutes = new ReactionRoutes();
