import { Server, Socket } from 'socket.io';

import { ILogin, ISocketData } from '@user/interfaces/user.interface';

export let socketIOUserHandler: Server;

export const connectedUserMap: Map<string, string> = new Map();

let users: string[] = [];

export class SocketIOUserHandler{
  private io: Server;

  constructor(io: Server) {
    this.io = io;
    socketIOUserHandler = io;
  };

  public listen(): void {
    this.io.on('connection', (socket: Socket) => {
      socket.on('setup', (data: ILogin) => {
        this.addClientToMap(data.userId, socket.id);
        this.addUser(data.userId);
        this.io.emit('user online', users);
      });

      socket.on('blocke User', (data: ISocketData) => {
        this.io.emit('blocked user id', data);
      });

      socket.on('unblock user', (data: ISocketData) => {
        this.io.emit('unblocked user id', data);
      });

      socket.on('disconnect', () => {
        this.removeClientFromMap(socket.id);
      });
    });
  };

  private addClientToMap(username: string, socketId: string): void {
    if (!connectedUserMap.has(username)) {
      connectedUserMap.set(username, socketId);
    };
  };

  private removeClientFromMap(socketId: string): void {
    if(Array.from(connectedUserMap.values()).includes(socketId)) {
      const disconnectedUser: [string, string] = [...connectedUserMap].find((user: [string, string]) => {
        return user[1] === socketId;
      }) as [string, string];
      connectedUserMap.delete(disconnectedUser[0]);
      this.removeUser(disconnectedUser[0]);
      this.io.emit('user online', users[0]);
    };
  };

  private addUser(username: string): void {
    users.push(username);
    users = [...new Set(users)];
  };

  private removeUser(username: string): void {
    users = users.filter((name: string) => name != username);
  };
};
