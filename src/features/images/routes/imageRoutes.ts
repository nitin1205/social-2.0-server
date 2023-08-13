import { authMiddleware } from '@global/helpers/auth-middleware';
import { AddImage } from '@image/controllers/add-image';
import { DeleteImage } from '@image/controllers/delete-image';
import { GetImages } from '@image/controllers/get-image';
import  express, { Router } from 'express';

class ImageRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  };

  public routes(): Router {
    this.router.get('/images/:userId', authMiddleware.checkAuthentication, GetImages.prototype.get);

    this.router.post('/images/profile', authMiddleware.checkAuthentication, AddImage.prototype.profileImage);
    this.router.post('/images/background', authMiddleware.checkAuthentication, AddImage.prototype.backgroundImage);

    this.router.delete('/images/:imageId', authMiddleware.checkAuthentication, DeleteImage.prototype.delete);
    this.router.delete('/images/background/:bgImageId', authMiddleware.checkAuthentication, DeleteImage.prototype.deleteBackgroundImage);

    return this.router;
  };
};

export const imageRoutes: ImageRoutes = new ImageRoutes();
