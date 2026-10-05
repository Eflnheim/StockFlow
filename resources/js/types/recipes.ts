export interface RecipeIngredient {
    id: number;
    name: string;
    unit: {
        symbol: string;
    };
    pivot: {
        quantity: string;
    };
}

export interface RecipeAvailableIngredient {
    id: number;
    name: string;
    unit: {
        symbol: string;
    };
}

export interface Recipe {
    id: number;
    name: string;
    selling_price: string;
    is_active: boolean;
    description: string | null;
}

export interface RecipeWithIngredients extends Recipe {
    ingredients: RecipeIngredient[];
}