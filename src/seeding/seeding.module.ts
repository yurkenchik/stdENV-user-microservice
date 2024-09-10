import {Module} from "@nestjs/common";
import {UserSeedingService} from "./services/user-seeding.service";
import {UserSeedingController} from "./controller/user-seeding.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Role} from "@studENV/shared/dist/entities/role.entity";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {RoleSeedingController} from "./controller/role-seeding.controller";
import {NatsClientModule} from "@studENV/shared/dist/nats-client/nats-client.module";
import {RoleSeedingService} from "./services/role-seeding.service";

@Module({
    providers: [UserSeedingService, RoleSeedingService],
    controllers: [UserSeedingController, RoleSeedingController],
    imports: [
        TypeOrmModule.forFeature([User, Role]),
        NatsClientModule
    ],
    exports: [UserSeedingService, RoleSeedingService]
})
export class SeedingModule {};