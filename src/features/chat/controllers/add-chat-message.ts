import { Request, Response } from 'express';
import { ObjectId }  from 'mongodb';
import mongoose from 'mongoose';
import HTTP_STATUS from 'http-status-codes';

import { addChatSchema } from '@chat/schemes/chat';
import { joiValidation } from '@global/decorators/joi-validation-decorators';
import { UserCache } from '@service/redis/user.cache';
import { IUserDocument } from '@user/interfaces/user.interface';
import { UploadApiResponse } from 'cloudinary';
import { uploads } from '@global/helpers/cloudinary-upload';
import { BadRequestError } from '@global/helpers/error-handler';
import { config } from '@root/config';
import { IMessageData, IMessageNotification } from '@chat/interfaces/chat.interface';
import { socketIOChatObject } from '@socket/chat';
import { INotificationTemplate } from '@notification/interfaces/notification.interface';
import { notificationTemplate } from '@service/emails/templates/notifications/notification-template';
import { emailQueue } from '@service/queues/email.queue';

const userCache: UserCache = new UserCache();

export class AddChat {
  @joiValidation(addChatSchema)
  public async messsage(req: Request, res: Response): Promise<void> {
    const {
      conversationId,
      receiverId,
      receiverUsername,
      receiverAvatarColor,
      receiverProfilePicture,
      gifUrl,
      isRead,
      selectedImage,
      body
    } = req.body;

    let fileUrl = '';
    const messageObjectId: ObjectId = new ObjectId();
    const conversationObjectId: ObjectId = !conversationId ? new ObjectId() : new mongoose.Types.ObjectId(conversationId);

    const sender: IUserDocument = await userCache.getUserFromCache(`${req.currentUser!.userId}`) as IUserDocument;

    if (selectedImage.length) {
      const result : UploadApiResponse = (await uploads(req.body.image, req.currentUser!.userId, true, true)) as UploadApiResponse;
      if(!result?.public_id) {
        throw new BadRequestError(result.messsage);
      };
      fileUrl = `https://res.cloudinary.com/${config.CLOUD_NAME}/image/upload/v${result.version}/${result.public_id}`;
    };

      const messageData: IMessageData = {
        _id: `${messageObjectId}`,
        conversationId: new mongoose.Types.ObjectId(conversationObjectId),
        receiverId,
        receiverAvatarColor,
        receiverProfilePicture,
        receiverUsername,
        senderUsername: `${req.currentUser!.username}`,
        senderId: `${req.currentUser!.userId}`,
        senderAvatarColor: `${req.currentUser!.avatarColor}`,
        senderProfilePicture: `${sender.profilePicture}`,
        body,
        isRead,
        gifUrl,
        selectedImage: fileUrl,
        reaction: [],
        createdAt: new Date(),
        deleteForEveryone: false,
        deleteForMe: false
      };

      AddChat.prototype.emitSocketIOEvent(messageData);

      if (!isRead) {
        AddChat.prototype.messageNotification({
          currentUser: req.currentUser!,
          message: body,
          receiverName: receiverUsername,
          receiverId,
          messageData,
        });
      };

      // add sender to chat list
      //  add receiver to chat list,
      // add messageData to chache
      // add message to chat queue

      res.status(HTTP_STATUS.OK).json({ message: 'Message added', conversationId: conversationObjectId });
  };

  private emitSocketIOEvent(data: IMessageData): void {
    socketIOChatObject.emit('message received', data);
    socketIOChatObject.emit('chat list', data);
  };

  private async messageNotification({ currentUser, message, receiverName, receiverId }: IMessageNotification): Promise<void> {
    const cachedUser: IUserDocument = await userCache.getUserFromCache(`${receiverId}`) as IUserDocument;

    if(cachedUser.notifications.messages) {
      const templateParams: INotificationTemplate = {
        username: receiverName,
        message,
        header: `Message notification from ${currentUser.username}`
      };
      const template: string = notificationTemplate.notificationMessageTemplate(templateParams);
      emailQueue.addEmailJob('directMessageEmail', { receiverEmail: currentUser.email, template, subject: `Youe've received message from ${currentUser.username}` });
    };
  };
};