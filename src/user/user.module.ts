import {Module} from "@nestjs/common";
import {UserService} from "./user.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserMicroserviceController} from "./user-microservice.controller";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {NatsClientModule} from "@studENV/shared/dist/nats-client/nats-client.module";
import {Role} from "@studENV/shared/dist/entities/role.entity";

@Module({
    providers: [UserService],
    controllers: [UserMicroserviceController],
    imports: [
        TypeOrmModule.forFeature([User, Role]),
        NatsClientModule
    ],
    exports: [UserService]
})
export class UserModule {}