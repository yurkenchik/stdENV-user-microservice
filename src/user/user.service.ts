import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UseFilters
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeepPartial, DeleteResult, Repository} from "typeorm";
import {CreateUserInput} from "@studENV/shared/dist/inputs/user/create-user.input";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {Role} from "@studENV/shared/dist/entities/role.entity";
import {MSRpcExceptionFilter} from "@studENV/shared/dist/filters/rcp-exception.filter";
import {IUserRepository} from "./interfaces/user-repository.interface";
import {FilterOptionsInput} from "@studENV/shared/dist/inputs/common/filter-options.input";

@Injectable()
@UseFilters(MSRpcExceptionFilter)
export class UserService implements IUserRepository {
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
            if (error.code === "23505") {
                throw new BadRequestException("User with this email already exists");
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async getUsers(filterOptionsInput: FilterOptionsInput): Promise<User[]> {
        const page = filterOptionsInput?.skip ?? 1;
        const pageSize = filterOptionsInput?.pageSize ?? 10;
        const skip = (page - 1) * pageSize;

        return await this.userRepository
            .createQueryBuilder("user")
            .skip(skip)
            .take(pageSize)
            .getMany();
    }
    
    async getUserById(userId: string): Promise<User> {
        const user = await this.userRepository
            .createQueryBuilder("user")
            .leftJoinAndSelect("user.role", "role")
            .where("user.id = :id", { id: userId })
            .getOne();
            
        if (!user) {
            throw new NotFoundException("User not found")
        }
        return user;
    }
    
    async getUserByEmail(userEmail: string): Promise<User> {
        const user = await this.userRepository
            .createQueryBuilder()
            .where("email = :email", { email: userEmail })
            .getOne();
            
        return user || null;
    }
    
    async getUserByUsername(username: string): Promise<User> {
        const user = await this.userRepository
            .createQueryBuilder()
            .where("username = :username", { username: username })
            .getOne();
            
        if (!user) {
            throw new NotFoundException("User not found")
        }
        return user;
    }

    async deleteUser(userId: string): Promise<DeleteResult> {
        return await this.userRepository
            .createQueryBuilder()
            .delete()
            .from(User)
            .where("id = :userId", { userId })
            .execute();
    }

    async updateUser(userId: string, updateUserInput: DeepPartial<User>): Promise<User> {
        await this.userRepository
            .createQueryBuilder()
            .where("id = :id", { id: userId })
            .update({ ...updateUserInput })
            .returning("*")
            .execute();

        return this.getUserById(userId);
    }

    async getUserBy(value: string, field: string): Promise<User> {
        const user = await this.userRepository
            .createQueryBuilder("user")
            .where(`user.${field} = :value`, { [field]: value })
            .getOne()

        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }
}