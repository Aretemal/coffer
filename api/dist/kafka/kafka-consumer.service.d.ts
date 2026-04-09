import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
export declare class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
    private readonly config;
    private readonly redis;
    private readonly log;
    private consumer;
    private kafka;
    private running;
    constructor(config: ConfigService, redis: RedisService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
