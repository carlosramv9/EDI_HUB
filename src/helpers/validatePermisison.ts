export const validatePermissions = (validate: string[] | string, permissions: string[]) => {
    if (Array.isArray(validate)) {
        return validate.some((permission) => {
            return permissions.includes(permission);
        });
    }
    return permissions.includes(validate);
}
