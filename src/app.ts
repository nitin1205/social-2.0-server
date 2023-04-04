import express, { Express } from 'express'

import { Server } from './setupServer';
import databaseConnection from './setupDatabase';

class Application {
    public initialize(): void {
        databaseConnection();
        
        const app: Express = express();

        const server = new Server(app);
        server.start();
    };
};

const application: Application = new Application();
application.initialize();