import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = new DocumentBuilder()
    .setTitle("Social API's")
    .setDescription("The social API's description")
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'Authorization'
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.use(helmet());
  //Specifically configure HSTS
  app.use(
    helmet.hsts({
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    })
  );
  // Set X-Frame-Options to prevent clickjacking
  app.use(helmet.frameguard({ action: 'deny' }));
  // Set Content Security Policy (CSP)
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "trusted-scripts.example.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    })
  );
  app.use(helmet.xssFilter()); // Sets X-XSS-Protection header
  app.use(helmet.noSniff()); // Sets X-Content-Type-Options header to 'nosniff'
  app.use(helmet.referrerPolicy({ policy: 'no-referrer' })); // Sets Referrer-Policy header
  app.use(helmet.expectCt({ maxAge: 86400 }));
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
