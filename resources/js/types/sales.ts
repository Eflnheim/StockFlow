export interface SaleCustomer {
    id: number;
    name: string;
}

export interface SaleUser {
    id: number;
    name: string;
}

export interface SaleRecipe {
    id: number;
    name: string;
    selling_price: string;
}

export interface SaleItem {
    id: number;
    quantity: string;
    unit_price: string;
    recipe: SaleRecipe;
}

export type SaleStatus =
    | 'pending'
    | 'completed'
    | 'cancelled';

export interface Sale {
    id: number;
    invoice_number: string;
    sale_date: string;
    total_amount: string;
    status: SaleStatus;
    customer: SaleCustomer | null;
}

export interface SaleWithItems extends Sale {
    notes: string | null;
    user: SaleUser;
    items: SaleItem[];
}
