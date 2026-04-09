import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, Kafka } from 'kafkajs';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly log = new Logger(KafkaConsumerService.name);
  private consumer: Consumer | null = null;
  private kafka: Kafka | null = null;
  private running = false;

  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {}

  async onModuleInit() {
    const brokers = this.config
      .get<string>('KAFKA_BROKERS', 'localhost:9092')
      .split(',')
      .map((b) => b.trim());
    const topic = this.config.get<string>('KAFKA_TOPIC_DOMAIN', 'coffer.domain');
    try {
      this.kafka = new Kafka({ clientId: 'coffer-api-consumer', brokers });
      this.consumer = this.kafka.consumer({ groupId: 'coffer-api-workers' });
      await this.consumer.connect();
      await this.consumer.subscribe({ topic, fromBeginning: false });
      this.running = true;
      void this.consumer
        .run({
          eachMessage: async ({ message }) => {
            if (!message.value) return;
            try {
              const evt = JSON.parse(message.value.toString()) as {
                type?: string;
                userId?: string;
              };
              if (evt.userId) {
                try {
                  await this.redis.delByPrefix(`summary:${evt.userId}:`);
                } catch {
                  /* Redis optional */
                }
              }
              this.log.debug(`Handled ${evt.type ?? 'event'} for ${evt.userId}`);
            } catch (e) {
              this.log.warn(`Consumer parse error: ${(e as Error).message}`);
            }
          },
        })
        .catch((e) => {
          if (this.running) this.log.warn(`Kafka consumer stopped: ${e.message}`);
        });
      this.log.log(`Kafka consumer subscribed to ${topic}`);
    } catch (e) {
      this.log.warn(`Kafka consumer not started: ${(e as Error).message}`);
    }
  }

  async onModuleDestroy() {
    this.running = false;
    if (this.consumer) {
      await this.consumer.disconnect().catch(() => undefined);
    }
  }
}
