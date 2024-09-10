import {CreateUserInput} from "@studENV/shared/dist/inputs/user/create-user.input";
import {faker} from "@faker-js/faker";

export const generateRandomUsers = (count: number) => {

    const users: Array<CreateUserInput> = [];

    for (let i: number = 0; i < count; i++) {
        const user: CreateUserInput = {
            firstname: faker.name.firstName(),
            lastname: faker.name.lastName(),
            username: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            age: faker.number.int({ min: 10, max: 99 }),
        }

        users.push(user);
    }

    return users;

};
