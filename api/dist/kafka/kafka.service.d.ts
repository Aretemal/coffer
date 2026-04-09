import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export type DomainEvent = {
    type: string;
    userId: string;
    payload: Record<string, unknown>;
    at: string;
};
export declare class KafkaService implements OnModuleDestroy {
    private readonly config;
    private readonly log;
    private producer;
    private kafka;
    constructor(config: ConfigService);
    private ensureProducer;
    publish(event: DomainEvent): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
