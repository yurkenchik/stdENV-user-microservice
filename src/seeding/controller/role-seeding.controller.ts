import {Controller, UseFilters} from "@nestjs/common";
import {MessagePattern} from "@nestjs/microservices";
import {MSRpcExceptionFilter} from "@studENV/shared/dist/filters/rcp-exception.filter";
import {SeedingOutput} from "@studENV/shared/dist/outputs/seeding/seeding.output";
import {RoleSeedingService} from "../services/role-seeding.service";

@Controller()
@UseFilters(MSRpcExceptionFilter)
export class RoleSeedingController {

    constructor(
        private readonly roleSeedingService: RoleSeedingService
    ) {};

    @MessagePattern({ cmd: "seedRoles" })
    async seedRole(): Promise<SeedingOutput> {
        await this.roleSeedingService.seedRoles();
        return { message: "Roles seeding passed successful" };
    }

}