import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';
import { usePermissions } from '@/hooks/use-permissions';
import type {
    RecipeAvailableIngredient,
    RecipeIngredient,
    RecipeWithIngredients,
} from '@/types/recipes';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { RecipeIngredientDialog } from '@/pages/recipes/components/recipe-ingredient-dialog';
import { RecipeIngredientEditDialog } from '@/pages/recipes/components/recipe-ingredient-edit-dialog';
import RecipeIngredientTable from '@/pages/recipes/components/recipe-ingredient-table';

type Props = {
    recipe: RecipeWithIngredients;
    ingredients: RecipeAvailableIngredient[];
};

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);
}

export default function Show({
    recipe,
    ingredients,
}: Props) {
    const { can } = usePermissions();

    const canEdit = can('update', 'recipes');

    const [ingredientDialogOpen, setIngredientDialogOpen] =
        useState(false);

    const [ingredientToEdit, setIngredientToEdit] =
        useState<RecipeIngredient | null>(null);

    const openEditDialog = (ingredient: RecipeIngredient) => {
        setIngredientToEdit(ingredient);
    };

    const closeEditDialog = (open: boolean) => {
        if (!open) {
            setIngredientToEdit(null);
        }
    };

    return (
        <>
            <Head title={recipe.name} />

            <div className="space-y-6">
                {/* Back */}
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="-ml-2"
                >
                    <Link href="/recipes">
                        <ArrowLeft />
                        Back to Recipes
                    </Link>
                </Button>

                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {recipe.name}
                            </h1>
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Recipe details and ingredient composition.
                        </p>
                    </div>

                    {canEdit && (
                        <Button asChild variant="outline">
                            <Link
                                href={`/recipes/${recipe.id}/edit`}
                            >
                                <Pencil />
                                Edit
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Recipe Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recipe Details</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Selling Price
                                </p>

                                <p className="mt-1 font-medium">
                                    {formatCurrency(
                                        Number(
                                            recipe.selling_price,
                                        ),
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Status
                                </p>

                                <p  className="mt-1 font-medium">
                                    {recipe.is_active
                                        ? 'Active'
                                        : 'Inactive'}
                                </p>
                            </div>

                            {recipe.description && (
                                <div className="sm:col-span-2">
                                    <p className="text-sm text-muted-foreground">
                                        Description
                                    </p>

                                    <p className="mt-1 whitespace-pre-wrap font-medium">
                                        {recipe.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recipe Ingredients */}
                <Card>
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <CardTitle>
                                Recipe Ingredients
                            </CardTitle>

                            <CardDescription>
                                Ingredients and quantities required for
                                one serving of this recipe.
                            </CardDescription>
                        </div>

                        {canEdit && (
                            <Button
                                type="button"
                                onClick={() =>
                                    setIngredientDialogOpen(true)
                                }
                            >
                                <Plus />
                                Add Ingredient
                            </Button>
                        )}
                    </CardHeader>

                    <CardContent>
                        {recipe.ingredients.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
                                <div className="mb-4 rounded-full bg-muted p-3">
                                    <Plus className="size-5 text-muted-foreground" />
                                </div>

                                <h3 className="font-medium">
                                    No ingredients yet
                                </h3>

                                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                    Add ingredients to define the
                                    composition of this recipe.
                                </p>

                                {canEdit && (
                                    <Button
                                        className="mt-4"
                                        variant="outline"
                                        onClick={() =>
                                            setIngredientDialogOpen(
                                                true,
                                            )
                                        }
                                    >
                                        <Plus />
                                        Add Ingredient
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <RecipeIngredientTable
                                recipeId={recipe.id}
                                ingredients={recipe.ingredients}
                                canEdit={canEdit}
                                onEdit={openEditDialog}
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Add Ingredient Dialog */}
            <RecipeIngredientDialog
                recipeId={recipe.id}
                ingredients={ingredients}
                open={ingredientDialogOpen}
                onOpenChange={setIngredientDialogOpen}
            />

            {/* Edit Ingredient Dialog */}
            <RecipeIngredientEditDialog
                recipeId={recipe.id}
                ingredient={ingredientToEdit}
                open={ingredientToEdit !== null}
                onOpenChange={closeEditDialog}
            />
        </>
    );
}
