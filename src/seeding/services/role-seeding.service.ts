import {Injectable} from "@nestjs/common";
import {DataSource} from "typeorm";
import {Role} from "@studENV/shared/dist/entities/role.entity";
import {generateRoles} from "../../seeders/roles-seeder";
import {RoleEnum} from "@studENV/shared/dist/utils/role.enum";
import {MSRpcExceptionFilter} from "@studENV/shared/dist/filters/rcp-exception.filter";

@Injectable()
export class RoleSeedingService {

    constructor(
        private readonly dataSource: DataSource,
    ) {}

    async seedRoles(): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();

        try {
            const roleRepository = queryRunner.manager.getRepository(Role);

            await roleRepository
                .createQueryBuilder()
                .insert()
                .into(Role)
                .values([ ...generateRoles() ])
                .execute();

            await queryRunner.commitTransaction();
        } catch (error) {
           await queryRunner.rollbackTransaction();
           throw new MSRpcExceptionFilter();
        } finally {
            await queryRunner.release();
        }
    }

}