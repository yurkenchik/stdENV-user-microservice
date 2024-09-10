import {Injectable} from "@nestjs/common";
import {DataSource} from "typeorm";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {generateRandomUsers} from "../../seeders/users-seeder";
import {MSRpcExceptionFilter} from "@studENV/shared/dist/filters/rcp-exception.filter";

@Injectable()
export class UserSeedingService {

    constructor(
        private readonly dataSource: DataSource
    ) {}

    async seedUsers(): Promise<void>
    {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const userRepository = queryRunner.manager.getRepository(User);

            await userRepository
              .createQueryBuilder()
              .insert()
              .into(User)
              .values([ ...generateRandomUsers(10) ])
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