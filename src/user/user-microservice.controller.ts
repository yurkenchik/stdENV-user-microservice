import {Args} from "@nestjs/graphql";
import {UserService} from "./user.service";
import {MessagePattern, Payload} from "@nestjs/microservices";
import {CreateUserInput} from "@studENV/shared/dist/inputs/user/create-user.input";
import {DeleteResult} from "typeorm";
import {UpdateUserInput} from "@studENV/shared/dist/inputs/user/update-user.input";
import {Controller, UseFilters} from "@nestjs/common";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {MSRpcExceptionFilter} from "@studENV/shared/dist/filters/rcp-exception.filter";
import {Role} from "@studENV/shared/dist/entities/role.entity";
import {FilterOptionsInput} from "@studENV/shared/dist/inputs/common/filter-options.input";

@Controller("user")
@UseFilters(MSRpcExceptionFilter)
export class UserMicroserviceController {
    
    constructor(
        private readonly userService: UserService
    ) {}

    @MessagePattern({ cmd: "createUser" })
    async createUser(
        @Payload() createUserPayload: {
            createUserInput: CreateUserInput,
            role: Role
        }
    ): Promise<User> {
        const { createUserInput, role } = createUserPayload;
        return await this.userService.createUser(createUserInput, role);
    }

    @MessagePattern({ cmd: "getUsers" })
    async getUsers(@Payload() filterOptionsDto: FilterOptionsInput): Promise<User[]> {
        const users = await this.userService.getUsers(filterOptionsDto);
        return users;
    }

    @MessagePattern({ cmd: "getUserById" })
    async getUserById(@Args("userId") userId: string): Promise<User> {
        return await this.userService.getUserById(userId);
    }

    @MessagePattern({ cmd: "getUserByEmail" })
    async getUserByEmail(email: string): Promise<User> {
        return await this.userService.getUserByEmail(email);
    }

    @MessagePattern({ cmd: "getUserByUsername" })
    async getUserByUsername(@Payload() username: string): Promise<User> {
        return await this.userService.getUserByUsername(username);
    }

    @MessagePattern({ cmd: "updateUser" })
    async updateUser(
        @Payload() updateUserPayload: {
            userId: string,
            updateUserInput: UpdateUserInput
        }
    ): Promise<User> {
        const { userId, updateUserInput } = updateUserPayload
        return await this.userService.updateUser(userId, updateUserInput);
    }

    @MessagePattern({ cmd: "deleteUser" })
    async deleteUser(userId: string): Promise<DeleteResult> {
        return await this.userService.deleteUser(userId);
    }

}