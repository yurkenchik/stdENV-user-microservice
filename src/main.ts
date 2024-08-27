import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices";

async function bootstrap() {

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.NATS,
      options: {
        servers: ['nats://localhost:4222'],
      }
    });

    await app.listen()
        .then(() => console.log("User microservice has successfully started!"))
        .catch(error => {
          console.error("Error starting authorization microservice: ", error);
          setTimeout(bootstrap, 10000);
        });

}
bootstrap();
