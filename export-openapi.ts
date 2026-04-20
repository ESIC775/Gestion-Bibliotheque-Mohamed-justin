import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './src/app.module';
import * as fs from 'fs';

async function generateOpenApi() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('API Bibliothèque')
    .setDescription('API RESTful de gestion de bibliothèque réalisée avec NestJS, Sequelize et MySQL.')
    .setVersion('1.0.0')
    .addTag('health')
    .addTag('users')
    .addTag('profiles')
    .addTag('authors')
    .addTag('categories')
    .addTag('books')
    .addTag('loans')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('./openapi.json', JSON.stringify(document, null, 2));
  
  console.log('OpenAPI documentation exported to openapi.json');
  await app.close();
  process.exit(0);
}

generateOpenApi().catch((err) => {
  console.error('Failed to export OpenAPI:', err);
  process.exit(1);
});
