import { OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
export declare class RedisService implements OnModuleDestroy {
    private readonly config;
    private readonly log;
    readonly client: Redis;
    constructor(config: ConfigService);
    getJson<T>(key: string): Promise<T | null>;
    setJson(key: string, value: unknown, ttlSec: number): Promise<void>;
    delByPrefix(prefix: string): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
