import express, { Express } from 'express';

import { SocialServer } from '@root/setupServer';
import databaseConnection from '@root/setupDatabase';
import { config } from '@root/config';

class Application {
    public initialize(): void {
        this.loadConfig();
        databaseConnection();

        const app: Express = express();

        const server = new SocialServer(app);
        server.start();
    };

    private loadConfig(): void {
        config.validateConfig();
    };
};

const application: Application = new Application();
application.initialize();
