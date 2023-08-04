import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

import { notificationQueue } from '@service/queues/notification.queue';
import { socketIONotificationObject } from '@socket/notifications';

export class DeleteNotification {
  public async delete(req: Request, res: Response): Promise<void> {
    const { notificationId } = req.params;
    socketIONotificationObject.emit('delete notification', { key: notificationId });
    notificationQueue.addNotificationJob('deleteNotification', { key: notificationId });

    res.status(HTTP_STATUS.OK).json({ message: 'Notification deleted successfully' });
  };
};
