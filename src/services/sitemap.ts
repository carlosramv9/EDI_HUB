interface RouteItem {
    title: string;
    path: string;
    children?: RouteItem[];
}

export const sitemap: RouteItem[] = [
    {
        title: 'Dashboard',
        path: '/dashboard'
    },
    {
        title: 'Labels',
        path: '/labels',
        children: [
            {
                title: 'Create Label',
                path: '/labels/create'
            },
            {
                title: 'Label List',
                path: '/labels/list'
            }
        ]
    },
    {
        title: 'Sents',
        path: '/sents',
        children: [
            {
                title: 'ASN Generator',
                path: '/sents/form/asn-generator'
            }
        ]
    },
    {
        title: 'Schedules',
        path: '/schedules',
        children: [
            {
                title: 'Schedule List',
                path: '/schedules/list'
            },
            {
                title: 'Create Schedule',
                path: '/schedules/create'
            }
        ]
    },
    {
        title: 'Settings',
        path: '/settings',
        children: [
            {
                title: 'Profile',
                path: '/settings/profile'
            },
            {
                title: 'Preferences',
                path: '/settings/preferences'
            }
        ]
    }
]; 