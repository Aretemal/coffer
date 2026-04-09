"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var KafkaConsumerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaConsumerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const kafkajs_1 = require("kafkajs");
const redis_service_1 = require("../redis/redis.service");
let KafkaConsumerService = KafkaConsumerService_1 = class KafkaConsumerService {
    constructor(config, redis) {
        this.config = config;
        this.redis = redis;
        this.log = new common_1.Logger(KafkaConsumerService_1.name);
        this.consumer = null;
        this.kafka = null;
        this.running = false;
    }
    async onModuleInit() {
        const brokers = this.config
            .get('KAFKA_BROKERS', 'localhost:9092')
            .split(',')
            .map((b) => b.trim());
        const topic = this.config.get('KAFKA_TOPIC_DOMAIN', 'coffer.domain');
        try {
            this.kafka = new kafkajs_1.Kafka({ clientId: 'coffer-api-consumer', brokers });
            this.consumer = this.kafka.consumer({ groupId: 'coffer-api-workers' });
            await this.consumer.connect();
            await this.consumer.subscribe({ topic, fromBeginning: false });
            this.running = true;
            void this.consumer
                .run({
                eachMessage: async ({ message }) => {
                    if (!message.value)
                        return;
                    try {
                        const evt = JSON.parse(message.value.toString());
                        if (evt.userId) {
                            try {
                                await this.redis.delByPrefix(`summary:${evt.userId}:`);
                            }
                            catch {
                            }
                        }
                        this.log.debug(`Handled ${evt.type ?? 'event'} for ${evt.userId}`);
                    }
                    catch (e) {
                        this.log.warn(`Consumer parse error: ${e.message}`);
                    }
                },
            })
                .catch((e) => {
                if (this.running)
                    this.log.warn(`Kafka consumer stopped: ${e.message}`);
            });
            this.log.log(`Kafka consumer subscribed to ${topic}`);
        }
        catch (e) {
            this.log.warn(`Kafka consumer not started: ${e.message}`);
        }
    }
    async onModuleDestroy() {
        this.running = false;
        if (this.consumer) {
            await this.consumer.disconnect().catch(() => undefined);
        }
    }
};
exports.KafkaConsumerService = KafkaConsumerService;
exports.KafkaConsumerService = KafkaConsumerService = KafkaConsumerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        redis_service_1.RedisService])
], KafkaConsumerService);
//# sourceMappingURL=kafka-consumer.service.js.map