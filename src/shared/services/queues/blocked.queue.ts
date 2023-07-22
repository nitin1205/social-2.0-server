import { IBlockedUserJobData } from '@follower/interfaces/follower.interface';
import { blockedUserWorker } from '@worker/blocked.worker';
import { BaseQueue } from '@service/queues/base.queue';

class BlockQueue extends BaseQueue {
  constructor() {
    super('block');
    this.processJob('addBlockedUserToDB', 5, blockedUserWorker.addBlockedUserToDB);
  };

  public addBkockUserJob(name: string, data: IBlockedUserJobData): void {
    this.addJob(name, data);
  };
};

export const blockQueue: BlockQueue = new BlockQueue();
