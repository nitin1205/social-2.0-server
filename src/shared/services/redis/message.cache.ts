import Logger from 'bunyan';
import { find, findIndex } from 'lodash';

import { config } from '@root/config';
import { BaseCache } from './base.cache';
import { ServerError } from '@global/helpers/error-handler';
import { IChatList, IChatUsers, IMessageData } from '@chat/interfaces/chat.interface';
import { Helpers } from '@global/helpers/helpers';

const log: Logger = config.createLogger('messageCache');

export class MessageCache extends BaseCache {
  constructor() {
    super('messageCache');
  };

  public async addChatListToCache(senderId: string, receiverId: string, conversationId: string): Promise<void> {
    try {
      if(!this.client.isOpen) {
        await this.client.connect();
      };
      const userChatList = await this.client.LRANGE(`chatList:${senderId}`, 0, -1);
      if (userChatList.length === 0) {
        await this.client.RPUSH(`chatList:${senderId}`, JSON.stringify({ receiverId, conversationId }));
      } else {
        const receiverIndex: number = findIndex(userChatList, (listItem: string) => listItem.includes(receiverId));

        if (receiverIndex < 0) {
          await this.client.RPUSH(`chatList:${senderId}`, JSON.stringify({ receiverId, conversationId }));
        };
      };
    } catch (error) {
      log.error(error);
      throw new ServerError('Server Error.Try again.');
    };
  };

  public async addChatMessageToCache(conversationId: string, value: IMessageData): Promise<void> {
    try {
      if(!this.client.isOpen) {
        await this.client.connect();
      };
      await this.client.RPUSH(`message:${conversationId}`, JSON.stringify(value));
    } catch (error) {
      log.error(error);
      throw new ServerError('Server Error.Try again.');
    };
  };

  public async addChatUserToCache(value: IChatUsers): Promise<IChatUsers[]> {
    try {
      if(!this.client.isOpen) {
        await this.client.connect();
      };
      const users: IChatUsers[] = await this.getChatUserList();
      const usersIndex: number = findIndex(users, (listItem: IChatUsers) => JSON.stringify(listItem) === JSON.stringify(value));
      let chatUsers: IChatUsers[] = [];
      if (usersIndex === -1) {
        await this.client.RPUSH('chatUsers', JSON.stringify(value));
        chatUsers = await this.getChatUserList();
      } else {
        chatUsers = users;
      };
      return chatUsers;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    };
  };

  public async removeChatUserFromCache(value: IChatUsers): Promise<IChatUsers[]> {
    try {
      if(!this.client.isOpen) {
        await this.client.connect();
      };
      const users: IChatUsers[] = await this.getChatUserList();
      const usersIndex: number = findIndex(users, (listItem: IChatUsers) => JSON.stringify(listItem) === JSON.stringify(value));
      let chatUsers: IChatUsers[] = [];
      if (usersIndex > -1) {
        await this.client.LREM('chatUsers', usersIndex, JSON.stringify(value));
        chatUsers = await this.getChatUserList();
      } else {
        chatUsers = users;
      };
      return chatUsers;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again.');
    };
  };

  public async getUserConversationList(key: string): Promise<IMessageData[]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      };
      const userChatList: string[] = await this.client.LRANGE(`chatList:${key}`, 0, -1);
      const conversationChatList: IMessageData[] = [];
      for (const item of userChatList) {
        const chatItem = Helpers.parseJson(item) as IChatList;
        const lastMessage: string = await this.client.LINDEX(`messages:${chatItem.conversationId}`, -1) as string;
        conversationChatList.push(Helpers.parseJson(lastMessage));
      };
      return conversationChatList;
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error.Try again.');
    };
  };


  public async getChatMessagesFromCache(senderId: string, receiverId: string): Promise<IMessageData[]> {
    try {
      if(!this.client.isOpen) {
        await this.client.connect();
      };
      const userChatList: string[] = await this.client.LRANGE(`chatList:${senderId}`,0, -1);
      const receiver: string = find(userChatList, (listItem: string) => listItem.includes(receiverId)) as string;
      const parsedReceiver: IChatList = Helpers.parseJson(receiver) as IChatList;
      if(parsedReceiver) {
        const userMessage: string[] = await this.client.LRANGE(`messages:${parsedReceiver.conversationId}`, 0 ,-1);
        const chatMessages: IMessageData[] = [];
        for(const item of userMessage) {
          const chatItem = Helpers.parseJson(item) as IMessageData;
          chatMessages.push(chatItem);
        };
        return chatMessages;
      } else {
        return [];
      };
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error. Try again');
    };
  };

  public async getChatUserList(): Promise<IChatUsers[]> {
    const chatUsersList: IChatUsers[] = [];
    const  chatUsers = await this.client.LRANGE('chatUsers', 0, -1);
    for (const item of chatUsers) {
      const chatUser: IChatUsers = Helpers.parseJson(item) as IChatUsers;
      chatUsersList.push(chatUser);
    };
    return chatUsersList;
  };
};
