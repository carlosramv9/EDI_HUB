import { useAppSelector } from '@/app/store';
import { validatePermissions } from '@/helpers/validatePermisison';
import React, { useEffect, useState } from 'react'

interface WithPermissionsProps {
    permissions: string[];
    children: React.ReactNode;
}

const WithPermissions = ({
    permissions,
    children,
}: WithPermissionsProps) => {
    const permisison = useAppSelector((state) => state.auth.user?.roleName);
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        setHasPermission(validatePermissions(permissions, [permisison ?? '']));
    }, [permisison, permissions]);

    if (!hasPermission) {
        return null;
    }

    return children;
}

export default WithPermissions