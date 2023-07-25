import { Server, Socket } from 'socket.io';

import { ISocketData } from '@user/interfaces/user.interface';

export let socketIOUserHandler: Server;

export class SocketIOUserHandler{
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOUserHandler = io;
  };

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      socket.on('blocke User', (data: ISocketData) => {
        this.io.emit('blocked user id', data);
      });

      socket.on('unblock user', (data: ISocketData) => {
        this.io.emit('unblocked user id', data);
      });
    });
  };
};
