import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';

import { config } from '@root/config';
import { emailQueue } from '@service/queues/email.queue';
import { forgotPasswordTemplate } from '@service/emails/templates/forgot-password/forgot-password-template';
import moment from 'moment';
import publicIP from 'ip';
import { IResetPasswordParams } from '@user/interfaces/user.interface';
import { resetPasswordTemplate } from '@service/emails/templates/reset-password/reset-password-template';

export class SignOut {
  public async update(req: Request, res: Response): Promise<void> {

    const tenpalateParams: IResetPasswordParams = {
      username: 'username',
      email: 'test@gmail.com',
      ipaddress: publicIP.address(),
      date: moment().format('DD/MM/YYYY HH:mm')
    };
    // const resetLink = `${config.CLIENT_URL}/reset-password?token=1234346985`;
    // const template: string = forgotPasswordTemplate.passwordResetTempalet('username', resetLink);
    const template: string = resetPasswordTemplate.passwordResetConfirmationTemplate(tenpalateParams);
    emailQueue.addEmailJob('forgotPasswordEmail', { template, receiverEmail: 'gerardo.dickens@ethereal.email', subject: 'password reset'});
    req.session = null;
    res.status(HTTP_STATUS.OK).json({ message: 'User logout successfully', user: {}, token: '' });
  };
};
