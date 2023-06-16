import Logger from 'bunyan';
import { find } from 'lodash';

import { config } from '@root/config';
import { ServerError } from '@global/helpers/error-handler';
import { BaseCache } from './base.cache';
import { IReaction, IReactionDocument } from '@reaction/interfaces/reaction.interface';
import { Helpers } from '@global/helpers/helpers';

const log: Logger = config.createLogger('reactionCache');

export class ReactionCache extends BaseCache {
  constructor() {
    super('reactionCache');
  };

  public async savePostReactionToCache(
    key: string,
    reaction: IReactionDocument,
    postReactions: IReaction,
    type: string,
    previousReaction: string
    ): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      };
      if (previousReaction) {
        this.removePostReactionFromCache(key, reaction.username, postReactions);
      };

      if (type) {
        await this.client.LPUSH(`raections:${key}`, JSON.stringify(reaction));
        await this.client.HSET(`post:${key}`, 'reactions', JSON.stringify(postReactions));
      };
    } catch(error) {
      log.error(error);
      throw new ServerError('Server error. Try again');
    }
  };

  public async removePostReactionFromCache(
    key: string,
    username: string,
    postReactions: IReaction
  ): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      };
      const response: string[] = await this.client.LRANGE(`${key}`, 0, -1);
      const multi: ReturnType<typeof this.client.multi> = this.client.multi();
      const userPreviousReaction: IReactionDocument = this.getPreviousReaction(response, username) as IReactionDocument;
      multi.LREM(`reactions:${key}`, 1, JSON.stringify(userPreviousReaction));
      await multi.exec();

      await this.client.HSET(`posts:${key}`, 'reactions', JSON.stringify(postReactions));
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error.Try again.');
    };
  };

  public async getReactionsFromCache(postId: string): Promise<[IReactionDocument[], number]> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      };
      const reactionsCount: number = await this.client.LLEN(`reactions:${postId}`);
      const response: string[] = await this.client.LRANGE(`reactions:${postId}`, 0, -1);
      const list: IReactionDocument[] = [];
      for (const item of response) {
        list.push(Helpers.parseJson(item));
      };
      return response.length ? [list, reactionsCount] : [[], 0];
    } catch (error) {
      log.error(error);
      throw new ServerError('Server Error. Try again.');
    };
  };

  public async getSingleReactionByUsernameFromCache(postId: string, username: string): Promise<[IReactionDocument, number] | []> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      };
      const response: string[] = await this.client.LRANGE(`reactions:${postId}`, 0, -1);
      const list: IReactionDocument[] = [];
      for (const item of response) {
        list.push(Helpers.parseJson(item));
      };
      const result: IReactionDocument = find(list, (listItem: IReactionDocument) => {
        return listItem.postId === postId && listItem.username === username;
      }) as IReactionDocument;
      return result ? [result, 1] : [];
    } catch (error) {
      log.error(error);
      throw new ServerError('Server Error. Try again.');
    };
  };

  private getPreviousReaction(response: string[], username: string): IReactionDocument | undefined {
    const list: IReactionDocument[] = [];
    for(const item of response) {
      list.push(Helpers.parseJson(item) as IReactionDocument);
    };
    return find(list, (listItem: IReactionDocument) => {
      return listItem.username === username;
    });
  };
};
