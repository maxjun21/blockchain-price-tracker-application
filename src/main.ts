import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './utils/swagger.services';
import morganMiddleware from './logger/morgan.logger';
import config from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use Morgan middleware
  app.use(morganMiddleware);

  setupSwagger(app);

  await app.listen(config().port || 3000);
}
bootstrap();
