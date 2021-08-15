export interface MessageQueueService {
  produceMessage<PayloadType extends object>(
    queueName: string,
    payload: PayloadType,
  ): Promise<void>;

  consumeMessage(queueName: string): Promise<void>;
}
