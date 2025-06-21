import { IconDefinition, IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCalendar, faDashboard, faFileAlt, faLock, faPaperPlane, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";

export type Sitemap = {
    name: string;
    children?: RouteItem[];
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

export type RouteItem = {
    name: string;
    path: string;
    children?: RouteItem[];
    icon?: IconProp;
    description?: string;
    isProtected?: boolean;
    isHidden?: boolean;
    isExternal?: boolean;
    isActive?: boolean;
    isDisabled?: boolean;
    isVisible: boolean;
    isDefault?: boolean;
}

export const routes: Sitemap[] = [
    {
        name: 'Main',
        isVisible: true,
        children: [
            {
                name: 'dashboard',
                // path: '/dashboard',
                path: '#',
                icon: faDashboard,
                isVisible: true,
            },
            {
                name: 'schedules',
                path: '/schedules',
                icon: faCalendar,
                isVisible: true,
            }
        ]
    },
    // {
    //     name: 'labels',
    //     isVisible: true,
    //     children: [
    //         {
    //             name: 'Manifest',
    //             path: '/schedules/manifest',
    //             icon: faFileAlt,
    //             isVisible: true,
    //         },
    //         {
    //             name: 'Packaging Requirements',
    //             path: '/schedules/packaging-requirements',
    //             icon: faFileAlt,
    //             isVisible: true,
    //         },
    //         {
    //             name: 'Skid Manifest',
    //             path: '/schedules/skid-manifest',
    //             icon: faFileAlt,
    //             isVisible: true,
    //         },
    //         {
    //             name: 'Pallet Master',
    //             path: '/schedules/pallet-master',
    //             icon: faFileAlt,
    //             isVisible: true,
    //         },
    //         {
    //             name: 'Production Parts',
    //             path: '/schedules/production-parts',
    //             icon: faFileAlt,
    //             isVisible: true,
    //         },
    //         {
    //             name: 'Special Rack',
    //             path: '/schedules/special-rack',
    //             icon: faFileAlt,
    //             isVisible: true,
    //         }
    //     ]
    // },
    // {
    //     name: 'operation',
    //     isVisible: true,
    //     children: [
    //         {
    //             name: 'schedulesSent',
    //             path: '/operation/sent',
    //             icon: faPaperPlane,
    //             isVisible: true,
    //         },
    //         {
    //             name: 'generateASN',
    //             path: '/operation/generate-asn',
    //             icon: faFileAlt,
    //             isVisible: true,
    //         },
    //     ]
    // },
    // {
    //     name: 'settings',
    //     isVisible: true,
    //     children: [
    //         {
    //             name: 'users',
    //             path: '/settings/users',
    //             icon: faUsers,
    //             isVisible: true,
    //         },
    //         {
    //             name: 'roles',
    //             path: '/settings/roles',
    //             icon: faLock,
    //             isVisible: true,
    //         }
    //     ]
    // }
];