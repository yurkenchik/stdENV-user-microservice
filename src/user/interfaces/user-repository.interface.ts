import { CreateUserInput } from '@studENV/shared/dist/inputs/user/create-user.input';
import { UpdateUserInput } from '@studENV/shared/dist/inputs/user/update-user.input';
import { User } from '@studENV/shared/dist/entities/user.entity';
import { Role } from '@studENV/shared/dist/entities/role.entity';
import {DeepPartial, DeleteResult} from "typeorm";
import {FilterOptionsInput} from "@studENV/shared/dist/inputs/common/filter-options.input";

export interface IUserRepository {
    createUser(createUserData: CreateUserInput, role: Role): Promise<User>;
    getUsers(filterOptionsInput: FilterOptionsInput): Promise<User[]>;
    getUserById(userId: string): Promise<User>;
    getUserByUsername(username: string): Promise<User>;
    getUserByEmail(email: string): Promise<User>;
    updateUser(userId: string, updateUserData: DeepPartial<User>): Promise<User>;
    deleteUser(userId: string): Promise<DeleteResult>;
}