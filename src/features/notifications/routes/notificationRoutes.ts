import express, { Router } from 'express';

import { authMiddleware } from '@global/helpers/auth-middleware';
import { DeleteNotification } from '@notification/controllers/delete-notification';
import { GetNotification } from '@notification/controllers/get-notifications';
import { UpdateNotification } from '@notification/controllers/update-notification';

class Notificationroutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  };

  public routes(): Router {
    this.router.get('/notifications', authMiddleware.checkAuthentication, GetNotification.prototype.get);

    this.router.put('/notification/:notificationId', authMiddleware.checkAuthentication, UpdateNotification.prototype.update);
    this.router.delete('/notification/:notificationId', authMiddleware.checkAuthentication, DeleteNotification.prototype.delete);

    return this.router;
  };
};

export const notificationRoutes: Notificationroutes = new Notificationroutes();
