import {
    BadRequestException,
    HttpException, HttpStatus,
    Injectable,
    InternalServerErrorException, Logger,
    NotFoundException, UseFilters
} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository} from "typeorm";
import {CreateUserInput} from "@studENV/shared/dist/inputs/user/create-user.input";
import {UpdateUserInput} from "@studENV/shared/dist/inputs/user/update-user.input";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {Role} from "@studENV/shared/dist/entities/role.entity";
import {MSRpcExceptionFilter} from "@studENV/shared/dist/filters/rcp-exception.filter";
import {RpcException} from "@nestjs/microservices";
import {RoleEnum} from "@studENV/shared/dist/utils/role.enum";

@Injectable()
@UseFilters(MSRpcExceptionFilter)
export class UserService {

    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>
    ) {}
    
    async createUser(createUserInput: CreateUserInput): Promise<User>
    {
        try {
            const userInsertResult = await this.userRepository
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({
                    ...createUserInput,
                })
                .returning('*')
                .execute();
            
            const userId = userInsertResult.identifiers[0].id;
            const user = await this.getUserById(userId);
            console.log("USER: ", user);
            return user;
        } catch (error) {
            this.logger.log(JSON.stringify({ error: error.message }, null, 2))
        }
    }
    
    async getUserById(userId: string): Promise<User>
    {
        try {
            const user = await this.userRepository
                .createQueryBuilder()
                .where("id = :id", { id: userId })
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
    
    async getUserByEmail(userEmail: string): Promise<User>
    {
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
    
    async getUserByUsername(username: string): Promise<User>
    {
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

    async deleteUser(userId: string): Promise<DeleteResult>
    {
        try {
            const user = await this.getUserById(userId);
            return await this.userRepository.delete(userId);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async updateUser(userId: string, updateUserInput: UpdateUserInput): Promise<User>
    {
        try {
            const updatedUser = await this.userRepository
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

    async getStudent(studentId: string): Promise<User>
    {
        try {
            const students = await this.userRepository
                .createQueryBuilder()
                .where("role = :studentRole", { studentRole: RoleEnum.STUDENT })
                .getMany();

            const student = students.find((student: User) => student.id === studentId);

            if (!student) {
                throw new NotFoundException("Student not found");
            }

            return student;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

}