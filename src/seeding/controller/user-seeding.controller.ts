import {Controller, UseFilters} from "@nestjs/common";
import {UserSeedingService} from "../services/user-seeding.service";
import {EventPattern, MessagePattern} from "@nestjs/microservices";
import {MSRpcExceptionFilter} from "@studENV/shared/dist/filters/rcp-exception.filter";

@Controller()
@UseFilters(MSRpcExceptionFilter)
export class UserSeedingController {

    constructor(
        private readonly userSeedingService: UserSeedingService
    ) {}

    @MessagePattern({ cmd: "seedUsers" })
    async seedUsers(): Promise<{ message: string }> {
        await this.userSeedingService.seedUsers();
        return { message: "Users seed passed successfully" };
    }

}