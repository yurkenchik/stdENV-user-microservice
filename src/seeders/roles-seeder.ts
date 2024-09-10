import {RoleEnum} from "@studENV/shared/dist/utils/role.enum";

export const generateRoles = () => {

    const roles: Array<{ role: RoleEnum }> = [];

    for (const role of Object.values(RoleEnum)) {
        const newRole = { role: role };
        roles.push(newRole);
    }

    return roles;
}