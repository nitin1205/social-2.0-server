import express, { Router } from 'express';

import { Signup } from '@auth/controllers/signup';
import { SignIn } from '@auth/controllers/signin';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  };

  public routes(): Router {
    this.router.post('/signup', Signup.prototype.create);
    this.router.post('/signin', SignIn.prototype.read);

    return this.router;
  };

};

export const authRoutes: AuthRoutes = new AuthRoutes();
