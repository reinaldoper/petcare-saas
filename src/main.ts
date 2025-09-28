import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    helmet({
      contentSecurityPolicy: true,
      crossOriginEmbedderPolicy: true,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('PetShop SaaS')
    .setDescription('API para pet shops e clínicas veterinárias')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port = process.env.PORT || 3001;

  await app.listen(port, () => {
    console.log(`Aplicação rodando na porta ${port}`);
  });
}
void bootstrap();
