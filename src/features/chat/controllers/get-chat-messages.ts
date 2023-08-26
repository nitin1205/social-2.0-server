import { Request, Response } from 'express';
import mongoose from 'mongoose';
import HTTP_STATUS from 'http-status-codes';

import { MessageCache } from '@service/redis/message.cache';
import { chatService } from '@service/db/chat.service';
import { IMessageData } from '@chat/interfaces/chat.interface';


const messageCache: MessageCache = new MessageCache();

export class GetChat {
  public async conversationList(req: Request, res: Response): Promise<void> {
    let list: IMessageData[] = [];
    const cachedList = await messageCache.getUserConversationList(`${req.currentUser!.userId}`);
    if(cachedList.length) {
      list = cachedList;
    } else {
      list = await chatService.getUserConversationList(new mongoose.Types.ObjectId(req.currentUser!.userId));
    };

    res.status(HTTP_STATUS.OK).json({ message: 'User conversation list', list});
   };
};
