import { Request, Response } from 'express';
import HTTP_STATUS from 'http-status-codes';

import { joiValidation } from '@global/decorators/joi-validation-decorators';
import { notificationSettingsSchema } from '@user/schemes/info';
import { userQueue } from '@service/queues/user.queue';

export class Setting {
  @joiValidation(notificationSettingsSchema)
  public async updateNotificationSetting(req: Request, res: Response): Promise<void> {
    userQueue.addUserJob('updateNotificationSettings', {
      key: `${req.currentUser!.userId}`,
      value: req.body
    });
    res.status(HTTP_STATUS.OK).json({ message: 'Notification settings updated', settings: req.body });
  };
};
