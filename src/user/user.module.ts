import {Module} from "@nestjs/common";
import {UserService} from "./user.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserMicroserviceController} from "./user-microservice.controller";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {NatsClientModule} from "@studENV/shared/dist/nats-client/nats-client.module";

@Module({
    providers: [UserService],
    controllers: [UserMicroserviceController],
    imports: [
        TypeOrmModule.forFeature([User]),
        NatsClientModule
    ],
    exports: [UserService]
})
export class UserModule {}