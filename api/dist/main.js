"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
function isLocalDevOrigin(origin) {
    try {
        const u = new URL(origin);
        const h = u.hostname.toLowerCase();
        return (h === 'localhost' ||
            h === '127.0.0.1' ||
            h === '0.0.0.0' ||
            h === '::1');
    }
    catch {
        return false;
    }
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const prod = process.env.NODE_ENV === 'production';
    const configured = process.env.CORS_ORIGIN?.split(',').map((s) => s.trim()).filter(Boolean);
    app.enableCors({
        origin: prod
            ? (configured?.length ? configured : false)
            : (origin, cb) => {
                if (!origin) {
                    cb(null, true);
                    return;
                }
                if (isLocalDevOrigin(origin)) {
                    cb(null, true);
                    return;
                }
                if (configured?.includes(origin)) {
                    cb(null, true);
                    return;
                }
                cb(null, false);
            },
        credentials: true,
        allowedHeaders: [
            'Content-Type',
            'Accept',
            'Authorization',
            'apollo-require-preflight',
            'x-apollo-operation-name',
        ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: false,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    const port = Number(process.env.PORT ?? 4000);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map