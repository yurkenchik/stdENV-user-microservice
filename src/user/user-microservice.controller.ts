import {Args} from "@nestjs/graphql";
import {UserService} from "./user.service";
import {MessagePattern, Payload, RpcException} from "@nestjs/microservices";
import {CreateUserInput} from "@studENV/shared/dist/inputs/user/create-user.input";
import {DeleteResult} from "typeorm";
import {UpdateUserInput} from "@studENV/shared/dist/inputs/user/update-user.input";
import {Controller, HttpException, InternalServerErrorException, UseFilters} from "@nestjs/common";
import {User} from "@studENV/shared/dist/entities/user.entity";
import {MSRpcExceptionFilter} from "@studENV/shared/dist/filters/rcp-exception.filter";

@Controller("user")
@UseFilters(MSRpcExceptionFilter)
export class UserMicroserviceController {
    
    constructor(
        private readonly userService: UserService
    ) {}

    @MessagePattern({ cmd: "createUser" })
    async createUser(@Payload() createUserInput: CreateUserInput): Promise<User>
    {
        try {
            return await this.userService.createUser(createUserInput);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            if (error instanceof RpcException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    @MessagePattern({ cmd: "getUserById" })
    async getUserById(@Args("userId") userId: string): Promise<User>
    {
        return await this.userService.getUserById(userId);
    }

    @MessagePattern({ cmd: "getUserByEmail" })
    async getUserByEmail(email: string): Promise<User>
    {
        return await this.userService.getUserByEmail(email);
    }

    @MessagePattern({ cmd: "getUserByUsername" })
    async getUserByUsername(@Payload() username: string): Promise<User>
    {
        return await this.userService.getUserByUsername(username);
    }

    @MessagePattern({ cmd: "updateUser" })
    async updateUser(
        @Payload() updateUserPayload: {
            userId: string,
            updateUserInput: UpdateUserInput
        }
    ): Promise<User>
    {
        const { userId, updateUserInput } = updateUserPayload
        return await this.userService.updateUser(userId, updateUserInput);
    }

    @MessagePattern({ cmd: "deleteUser" })
    async deleteUser(userId: string): Promise<DeleteResult>
    {
        return await this.userService.deleteUser(userId);
    }

}