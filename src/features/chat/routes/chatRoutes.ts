import { Router } from 'express';

import { authMiddleware } from '@global/helpers/auth-middleware';
import { AddChat } from '@chat/controllers/add-chat-message';
import { GetChat } from '@chat/controllers/get-chat-messages';
import { DeleteChat } from '@chat/controllers/delete-chat-message';
import { UpdateChat } from '@chat/controllers/update-chat-message';

class ChatRoutes {
  private router: Router;

  constructor() {
    this.router = Router();
  };

  public routes(): Router {
    this.router.get('/chat/message/coversation-list', authMiddleware.checkAuthentication, GetChat.prototype.conversationList);
    this.router.get('/chat/message/user/receiverId:', authMiddleware.checkAuthentication, GetChat.prototype.messages);

    this.router.post('/chat/message', authMiddleware.checkAuthentication, AddChat.prototype.messsage);
    this.router.post('/chat/message/add-chat-users', authMiddleware.checkAuthentication, AddChat.prototype.addChatUsers);
    this.router.post('/chat/message/remove-chat-users', authMiddleware.checkAuthentication, AddChat.prototype.removeChatUsers);

    this.router.post('/chat/message/mark-as-read', authMiddleware.checkAuthentication, UpdateChat.prototype.markMessageAsRead);

    this.router.delete('/chat/message/mark-as-deleted/:messageId/:senderId/:receiverId/:type', authMiddleware.checkAuthentication, DeleteChat.prototype.markMessageAsDeleted);
    return this.router;
  };
};

export const chatRoutes: ChatRoutes = new ChatRoutes();
