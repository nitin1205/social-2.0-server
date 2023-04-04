import mongoose from 'mongoose';

export default () => {
    const connect = () => {
        mongoose.connect('mongodb://localhost:27017/social:2:0-backend')
            .then(() => {
                console.log('Successfully connected to database')
            })
            .catch((error) => {
                console.log('Error connecting database', error);
                return process.exit(1);
            });
    };
    connect();

    mongoose.connection.on('disconnected', connect);
}; 