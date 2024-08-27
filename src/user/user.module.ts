import {Module} from "@nestjs/common";
import {UserService} from "./user.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserMicroserviceController} from "./user-microservice.controller";
import {User} from "@studENV/shared/dist/entities/user.entity";

@Module({
    providers: [UserService],
    controllers: [UserMicroserviceController],
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    exports: [UserService]
})
export class UserModule {}