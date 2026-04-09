import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';

export type DomainEvent = {
  type: string;
  userId: string;
  payload: Record<string, unknown>;
  at: string;
};

@Injectable()
export class KafkaService implements OnModuleDestroy {
  private readonly log = new Logger(KafkaService.name);
  private producer: Producer | null = null;
  private kafka: Kafka | null = null;

  constructor(private readonly config: ConfigService) {}

  private async ensureProducer(): Promise<Producer | null> {
    if (this.producer) return this.producer;
    const brokers = this.config
      .get<string>('KAFKA_BROKERS', 'localhost:9092')
      .split(',')
      .map((b) => b.trim());
    try {
      this.kafka = new Kafka({ clientId: 'coffer-api', brokers });
      this.producer = this.kafka.producer();
      await this.producer.connect();
      this.log.log(`Kafka producer connected (${brokers.join(',')})`);
      return this.producer;
    } catch (e) {
      this.log.warn(`Kafka producer unavailable: ${(e as Error).message}`);
      return null;
    }
  }

  async publish(event: DomainEvent): Promise<void> {
    const topic = this.config.get<string>('KAFKA_TOPIC_DOMAIN', 'coffer.domain');
    const p = await this.ensureProducer();
    if (!p) return;
    try {
      await p.send({
        topic,
        messages: [
          {
            key: event.userId,
            value: JSON.stringify(event),
          },
        ],
      });
    } catch (e) {
      this.log.warn(`Kafka publish failed: ${(e as Error).message}`);
    }
  }

  async onModuleDestroy() {
    if (this.producer) {
      await this.producer.disconnect().catch(() => undefined);
    }
  }
}
