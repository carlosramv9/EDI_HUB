import { useAppSelector } from '@/app/store';
import { validatePermissions } from '@/helpers/validatePermisison';
import React from 'react'

interface WithPermissionsProps {
    permissions: string[];
    children: React.ReactNode;
}

const WithPermissions = ({
    permissions,
    children,
}: WithPermissionsProps) => {
    const permisison = useAppSelector((state) => state.auth.user?.roleName);
    const hasPermission = validatePermissions(permissions, [permisison ?? '']);

    if (!hasPermission) {
        return null;
    }

    return children;
}

export default WithPermissions