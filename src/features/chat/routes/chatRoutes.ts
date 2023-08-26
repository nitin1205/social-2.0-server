import { Router } from 'express';

import { authMiddleware } from '@global/helpers/auth-middleware';
import { AddChat } from '@chat/controllers/add-chat-message';
import { GetChat } from '@chat/controllers/get-chat-messages';

class ChatRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  };

  public routes(): Router {
    this.router.get('/chat/message/coversation-list', authMiddleware.checkAuthentication, GetChat.prototype.conversationList);

    this.router.post('/chat/message', authMiddleware.checkAuthentication, AddChat.prototype.messsage);
    this.router.post('/chat/message/add-chat-users', authMiddleware.checkAuthentication, AddChat.prototype.addChatUsers);
    this.router.post('/chat/message/remove-chat-users', authMiddleware.checkAuthentication, AddChat.prototype.removeChatUsers);
    return this.router;
  };
};

export const chatRoutes: ChatRoutes = new ChatRoutes();
