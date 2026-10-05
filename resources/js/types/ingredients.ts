export interface IngredientCategory {
    id: number;
    name: string;
}

export interface Unit {
    id: number;
    name: string;
    symbol: string;
}

export interface Ingredient {
    id: number;
    ingredient_category_id: number;
    unit_id: number;
    name: string;
    minimum_stock: string;
    is_active: boolean;
    category: IngredientCategory;
    unit: Unit;
}