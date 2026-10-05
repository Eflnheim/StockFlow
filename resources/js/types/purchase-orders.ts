import type { Supplier } from '@/types/suppliers';

export type PurchaseOrderStatus =
    | 'pending'
    | 'received'
    | 'cancelled';

export interface PurchaseOrderUser {
    id: number;
    name: string;
}

export interface PurchaseOrderIngredient {
    id: number;
    name: string;
    unit: {
        id: number;
        name: string;
        symbol: string;
    };
}

export interface PurchaseItem {
    id: number;
    quantity: string;
    unit_price: string;
    ingredient: PurchaseOrderIngredient;
}

export interface PurchaseOrder {
    id: number;
    supplier_id: number;
    supplier: Supplier;
    user: PurchaseOrderUser;
    order_number: string;
    order_date: string;
    status: PurchaseOrderStatus;
    notes: string | null;
    created_at: string;
    items: PurchaseItem[];
}
