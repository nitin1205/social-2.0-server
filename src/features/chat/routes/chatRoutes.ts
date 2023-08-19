import { Router } from 'express';

import { authMiddleware } from '@global/helpers/auth-middleware';
import { AddChat } from '@chat/controllers/add-chat-message';

class ChatRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  };

  public routes(): Router {
    this.router.post('/chat/message', authMiddleware.checkAuthentication, AddChat.prototype.messsage);
    return this.router;
  };
};

export const chatRoutes: ChatRoutes = new ChatRoutes();
