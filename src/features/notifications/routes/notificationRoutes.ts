import { authMiddleware } from '@global/helpers/auth-middleware';
import { DeleteNotification } from '@notification/controllers/delete-notification';
import { UpdateNotification } from '@notification/controllers/update-notification';
import express, { Router } from 'express';

class Notificationroutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  };

  public routes(): Router {
    this.router.put('/notification/:notificationId', authMiddleware.checkAuthentication, UpdateNotification.prototype.update);
    this.router.delete('/notification/:notificationId', authMiddleware.checkAuthentication, DeleteNotification.prototype.delete);

    return this.router;
  };
};

export const notificationRoutes: Notificationroutes = new Notificationroutes();
