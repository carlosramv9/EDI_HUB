export type Sitemap = {
    name: string;
    path: string;
    children?: Sitemap[];
    icon?: string;
    description?: string;
    isProtected?: boolean;
    isHidden?: boolean;
    isExternal?: boolean;
    isActive?: boolean;
    isDisabled?: boolean;
    isVisible: boolean;
    isDefault?: boolean;
};

export const routes: Sitemap[] = [
    {
        name: 'dashboard',
        path: '/dashboard',
        isVisible: true,
    },
    {
        name: 'labels',
        path: '/labels',
        isVisible: true,
        children: [
            {
                name: 'Master Packing Label',
                path: '/labels/master-packing-label',
                isVisible: true,
            },
            {
                name: 'Shipping Label',
                path: '/labels/shipping-label',
                isVisible: true,
            }
        ]
    },
    {
        name: 'settings',
        path: '/settings',
        isVisible: true,
        children: [
            {
                name: 'profile',
                path: '/settings/profile',
                isVisible: true,
            },
            {
                name: 'account',
                path: '/settings/account',
                isVisible: true,
            }
        ]
    }
];