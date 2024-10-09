import {
    HttpException,
    Injectable,
    InternalServerErrorException, Logger,
    NotFoundException, UseFilters
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, DeleteResult, Repository} from "typeorm";
import {CreateUserInput} from "@studENV/shared/dist/inputs/user/create-user.input";
import {UpdateUserInput} from "@studENV/shared/dist/inputs/user/update-user.input";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {Role} from "@studENV/shared/dist/entities/role.entity";
import {MSRpcExceptionFilter} from "@studENV/shared/dist/filters/rcp-exception.filter";
import {RpcException} from "@nestjs/microservices";
import {IUserRepository} from "./interfaces/user-repository.interface";
import {FilterOptionsInput} from "@studENV/shared/dist/inputs/common/filter-options.input";

@Injectable()
@UseFilters(MSRpcExceptionFilter)
export class UserService implements IUserRepository {

    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async createUser(createUserInput: CreateUserInput, role: Role): Promise<User> {
        try {
            const userInsertResult = await this.userRepository
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({
                    ...createUserInput,
                    role: role
                })
                .returning('*')
                .execute();
            
            const userId = userInsertResult.identifiers[0].id;
            const user = await this.getUserById(userId);

            return user;
        } catch (error) {
            this.logger.log(JSON.stringify({ error: error.message }, null, 2))
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async getUsers(filterOptionsInput: FilterOptionsInput): Promise<User[]> {
        try {
            const page = filterOptionsInput?.skip ?? 1;
            const pageSize = filterOptionsInput?.pageSize ?? 10;
            const skip = (page - 1) * pageSize;

            console.log(`Pagination params - PageSize: ${pageSize}, Page: ${pageSize}, Skip: ${skip}`);

            return await this.userRepository
                .createQueryBuilder("user")
                .skip(skip)
                .take(pageSize)
                .getMany();
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }
    
    async getUserById(userId: string): Promise<User> {
        try {
            const user = await this.userRepository
                .createQueryBuilder("user")
                .leftJoinAndSelect("user.role", "role")
                .where("user.id = :id", { id: userId })
                .getOne();
            
            if (!user) throw new NotFoundException("User not found")
            
            return user;
        } catch (error) {
            if (error instanceof RpcException) {
                throw error;
            }
            throw new RpcException(error.message);
        }
    }
    
    async getUserByEmail(userEmail: string): Promise<User> {
        try {
            const user = await this.userRepository
                .createQueryBuilder()
                .where("email = :email", { email: userEmail })
                .getOne();
            
            return user || null;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }
    
    async getUserByUsername(username: string): Promise<User> {
        try {
            const user = await this.userRepository
                .createQueryBuilder()
                .where("username = :username", { username: username })
                .getOne();
            
            if (!user) throw new NotFoundException("User not found")
            
            return user;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async deleteUser(userId: string): Promise<DeleteResult> {
        try {
            return await this.userRepository.delete(userId);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async updateUser(userId: string, updateUserInput: DeepPartial<User>): Promise<User> {
        try {
            await this.userRepository
                .createQueryBuilder()
                .where("id = :id", { id: userId })
                .update({ ...updateUserInput })
                .returning("*")
                .execute();

            const user = await this.getUserById(userId);
            return user;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

}