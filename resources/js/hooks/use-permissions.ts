import { usePage } from '@inertiajs/react';

import type { Auth } from '@/types';

type PermissionAction = 'create' | 'update' | 'delete';

type PermissionResource =
    | 'ingredient-categories'
    | 'units'
    | 'ingredients'
    | 'suppliers'
    | 'purchase-orders';

const permissions: Record<
    PermissionAction,
    Record<PermissionResource, string[]>
> = {
    create: {
        'ingredient-categories': ['Admin', 'Purchasing'],
        units: ['Admin', 'Purchasing'],
        ingredients: ['Admin', 'Purchasing'],
        suppliers: ['Admin', 'Purchasing'],
        'purchase-orders': ['Admin', 'Purchasing'],
    },

    update: {
        'ingredient-categories': ['Admin', 'Purchasing'],
        units: ['Admin', 'Purchasing'],
        ingredients: ['Admin', 'Purchasing'],
        suppliers: ['Admin', 'Purchasing'],
        'purchase-orders': ['Admin', 'Purchasing'],
    },

    delete: {
        'ingredient-categories': ['Admin', 'Purchasing'],
        units: ['Admin', 'Purchasing'],
        ingredients: ['Admin', 'Purchasing'],
        suppliers: ['Admin', 'Purchasing'],
        'purchase-orders': ['Admin', 'Purchasing'],
    },
};

export function usePermissions() {
    const { auth } = usePage<{ auth: Auth }>().props;

    const role = auth.user.role?.name;

    const can = (
        action: PermissionAction,
        resource: PermissionResource,
    ): boolean => {
        return permissions[action][resource].includes(role ?? '');
    };

    return { can };
}