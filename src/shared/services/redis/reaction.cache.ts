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
        const dataToSave: string[] = ['reactions', JSON.stringify(postReactions)];
        await this.client.HSET(`post:${key}`, dataToSave);
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

      const dataToSave: string[] = ['reactions', JSON.stringify(postReactions)];
      await this.client.HSET(`posts:${key}`, dataToSave);
    } catch (error) {
      log.error(error);
      throw new ServerError('Server error.Try again.');
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
