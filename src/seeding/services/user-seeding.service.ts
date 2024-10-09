import {Injectable} from "@nestjs/common";
import {DataSource} from "typeorm";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {generateRandomUsers} from "../../seeders/users-seeder";
import {MSRpcExceptionFilter} from "@studENV/shared/dist/filters/rcp-exception.filter";
import {Role} from "@studENV/shared/dist/entities/role.entity";
import {RoleEnum} from "@studENV/shared/dist/utils/role.enum";

@Injectable()
export class UserSeedingService {

    constructor(
        private readonly dataSource: DataSource
    ) {}

    async seedUsers(): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const userRepository = queryRunner.manager.getRepository(User);
            const roleRepository = queryRunner.manager.getRepository(Role);

            const roles = Object.values(RoleEnum);
            const randomRoleIndex = Math.floor(Math.random() * roles.length);

            const role = await roleRepository
                .createQueryBuilder()
                .where("role = :role", { role: roles[randomRoleIndex] })
                .getOne();

            const updatedGeneratedRandomUsersWithRole = generateRandomUsers(50).map(randomUser => {
                return { ...randomUser, role }
            });

            await userRepository
                .createQueryBuilder()
                .insert()
                .into(User)
                .values([ ...updatedGeneratedRandomUsersWithRole ])
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