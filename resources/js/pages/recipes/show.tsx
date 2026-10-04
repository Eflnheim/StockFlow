import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

import { RecipeIngredientDialog } from '@/pages/recipes/components/recipe-ingredient-dialog';
import { RecipeIngredientEditDialog } from '@/pages/recipes/components/recipe-ingredient-edit-dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { usePermissions } from '@/hooks/use-permissions';

type Ingredient = {
    id: number;
    name: string;
    unit: {
        symbol: string;
    };
    pivot: {
        quantity: string;
    };
};

type AvailableIngredient = {
    id: number;
    name: string;
    unit: {
        symbol: string;
    };
};

type Recipe = {
    id: number;
    name: string;
    selling_price: string;
    is_active: boolean;
    description: string | null;
    ingredients: Ingredient[];
};

type Props = {
    recipe: Recipe;
    ingredients: AvailableIngredient[];
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
        useState<Ingredient | null>(null);

    const [ingredientToDelete, setIngredientToDelete] =
        useState<Ingredient | null>(null);

    const {
        delete: destroy,
        processing: deleteProcessing,
    } = useForm();

    const openEditDialog = (ingredient: Ingredient) => {
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

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {recipe.name}
                            </h1>

                            <Badge
                                variant={
                                    recipe.is_active
                                        ? 'secondary'
                                        : 'outline'
                                }
                            >
                                {recipe.is_active
                                    ? 'Active'
                                    : 'Inactive'}
                            </Badge>
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
                                Edit Recipe
                            </Link>
                        </Button>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recipe Details</CardTitle>

                        <CardDescription>
                            Basic information about this recipe.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Selling Price
                                </p>

                                <p className="mt-1 text-lg font-semibold">
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

                                <div className="mt-2">
                                    <Badge
                                        variant={
                                            recipe.is_active
                                                ? 'secondary'
                                                : 'outline'
                                        }
                                    >
                                        {recipe.is_active
                                            ? 'Active'
                                            : 'Inactive'}
                                    </Badge>
                                </div>
                            </div>

                            {recipe.description && (
                                <div className="sm:col-span-2">
                                    <p className="text-sm text-muted-foreground">
                                        Description
                                    </p>

                                    <p className="mt-1 text-sm">
                                        {recipe.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

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
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-16 font-semibold text-foreground">
                                                #
                                            </TableHead>

                                            <TableHead className="font-semibold text-foreground">
                                                Ingredient
                                            </TableHead>

                                            <TableHead className="text-right font-semibold text-foreground">
                                                Quantity
                                            </TableHead>

                                            <TableHead className="font-semibold text-foreground">
                                                Unit
                                            </TableHead>

                                            {canEdit && (
                                                <TableHead className="text-right font-semibold text-foreground">
                                                    Actions
                                                </TableHead>
                                            )}
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {recipe.ingredients.map(
                                            (
                                                ingredient,
                                                index,
                                            ) => (
                                                <TableRow
                                                    key={
                                                        ingredient.id
                                                    }
                                                >
                                                    <TableCell className="text-muted-foreground">
                                                        {index + 1}
                                                    </TableCell>

                                                    <TableCell className="font-medium">
                                                        {
                                                            ingredient.name
                                                        }
                                                    </TableCell>

                                                    <TableCell className="text-right">
                                                        {Number(
                                                            ingredient
                                                                .pivot
                                                                .quantity,
                                                        )}
                                                    </TableCell>

                                                    <TableCell>
                                                        <Badge
                                                            variant="secondary"
                                                            className="font-mono"
                                                        >
                                                            {
                                                                ingredient
                                                                    .unit
                                                                    .symbol
                                                            }
                                                        </Badge>
                                                    </TableCell>

                                                    {canEdit && (
                                                        <TableCell>
                                                            <div className="flex justify-end gap-2">
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        openEditDialog(
                                                                            ingredient,
                                                                        )
                                                                    }
                                                                >
                                                                    <Pencil />
                                                                    <span className="hidden sm:inline">
                                                                        Edit
                                                                    </span>
                                                                </Button>

                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-destructive hover:text-destructive"
                                                                    onClick={() =>
                                                                        setIngredientToDelete(
                                                                            ingredient,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 />
                                                                    <span className="hidden sm:inline">
                                                                        Delete
                                                                    </span>
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            ),
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <RecipeIngredientDialog
                recipeId={recipe.id}
                ingredients={ingredients}
                open={ingredientDialogOpen}
                onOpenChange={setIngredientDialogOpen}
            />

            <RecipeIngredientEditDialog
                recipeId={recipe.id}
                ingredient={ingredientToEdit}
                open={ingredientToEdit !== null}
                onOpenChange={closeEditDialog}
            />

            <AlertDialog
                open={ingredientToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setIngredientToDelete(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Remove ingredient?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will remove{' '}
                            <span className="font-medium text-foreground">
                                {ingredientToDelete?.name}
                            </span>{' '}
                            from this recipe. This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            variant="destructive"
                            disabled={deleteProcessing}
                            onClick={() => {
                                if (!ingredientToDelete) {
                                    return;
                                }

                                destroy(
                                    `/recipes/${recipe.id}/ingredients/${ingredientToDelete.id}`,
                                );

                                setIngredientToDelete(null);
                            }}
                        >
                            {deleteProcessing ? (
                                'Removing...'
                            ) : (
                                'Remove Ingredient'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
