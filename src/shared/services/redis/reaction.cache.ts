import Logger from 'bunyan';

import { config } from '@root/config';
import { ServerError } from '@global/helpers/error-handler';
import { BaseCache } from './base.cache';
import { IReaction, IReactionDocument } from '@reaction/interfaces/reaction.interface';

const log: Logger = config.createLogger('reactionCache');

export class ReactionCache extends BaseCache {
  constructor() {
    super('reactionCache');
  };

  public async savePostReactionToCache(
    key: string,
    reaction: IReactionDocument,
    postReaction: IReaction,
    type: string,
    previousReaction: string
    ): Promise<void> {
    try {
      if (!this.client.isOpen) {
        await this.client.connect();
      };
      if (previousReaction) {
        // call remove reaction method
      };

      if (type) {
        await this.client.LPUSH(`raections:${key}`, JSON.stringify(reaction));
        const dataToSave: string[] = ['reactions', JSON.stringify(postReaction)];
        await this.client.HSET(`post:${key}`, dataToSave);
      };
    } catch(error) {
      log.error(error);
      throw new ServerError('Server error. Try again');
    }
  };
};
