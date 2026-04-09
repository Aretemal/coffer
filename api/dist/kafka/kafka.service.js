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
var KafkaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const kafkajs_1 = require("kafkajs");
let KafkaService = KafkaService_1 = class KafkaService {
    constructor(config) {
        this.config = config;
        this.log = new common_1.Logger(KafkaService_1.name);
        this.producer = null;
        this.kafka = null;
    }
    async ensureProducer() {
        if (this.producer)
            return this.producer;
        const brokers = this.config
            .get('KAFKA_BROKERS', 'localhost:9092')
            .split(',')
            .map((b) => b.trim());
        try {
            this.kafka = new kafkajs_1.Kafka({ clientId: 'coffer-api', brokers });
            this.producer = this.kafka.producer();
            await this.producer.connect();
            this.log.log(`Kafka producer connected (${brokers.join(',')})`);
            return this.producer;
        }
        catch (e) {
            this.log.warn(`Kafka producer unavailable: ${e.message}`);
            return null;
        }
    }
    async publish(event) {
        const topic = this.config.get('KAFKA_TOPIC_DOMAIN', 'coffer.domain');
        const p = await this.ensureProducer();
        if (!p)
            return;
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
        }
        catch (e) {
            this.log.warn(`Kafka publish failed: ${e.message}`);
        }
    }
    async onModuleDestroy() {
        if (this.producer) {
            await this.producer.disconnect().catch(() => undefined);
        }
    }
};
exports.KafkaService = KafkaService;
exports.KafkaService = KafkaService = KafkaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], KafkaService);
//# sourceMappingURL=kafka.service.js.map