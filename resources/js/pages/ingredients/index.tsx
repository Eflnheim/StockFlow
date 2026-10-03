import { Head, Link, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Category {
    id: number;
    name: string;
}

interface Unit {
    id: number;
    name: string;
    symbol: string;
}

interface Ingredient {
    id: number;
    name: string;
    minimum_stock: string;
    is_active: boolean;
    category: Category;
    unit: Unit;
}

interface Props {
    ingredients: Ingredient[];
}

export default function Index({ ingredients }: Props) {
    const { delete: destroy, processing } = useForm();

    const [ingredientToDelete, setIngredientToDelete] =
        useState<Ingredient | null>(null);

    const handleDelete = () => {
        if (!ingredientToDelete) {
            return;
        }

        destroy(`/ingredients/${ingredientToDelete.id}`, {
            onSuccess: () => {
                setIngredientToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Ingredients" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Ingredients
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage the ingredients used in your inventory.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href="/ingredients/create">
                            <Plus />
                            Add Ingredient
                        </Link>
                    </Button>
                </div>

                {/* Ingredients Card */}
                <Card className="py-2">
                    <CardContent>
                        {ingredients.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                                <div className="mb-4 rounded-full bg-muted p-3">
                                    <Plus className="size-5 text-muted-foreground" />
                                </div>

                                <h3 className="font-medium">
                                    No ingredients yet
                                </h3>

                                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                    Create ingredient to start
                                    managing inventory.
                                </p>

                                <Button asChild className="mt-4">
                                    <Link href="/ingredients/create">
                                        <Plus />
                                        Add Ingredient
                                    </Link>
                                </Button>
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

                                            <TableHead className="font-semibold text-foreground">
                                                Category
                                            </TableHead>

                                            <TableHead className="font-semibold text-foreground">
                                                Unit
                                            </TableHead>

                                            <TableHead className="font-semibold text-foreground">
                                                Minimum Stock
                                            </TableHead>

                                            <TableHead className="font-semibold text-foreground">
                                                Status
                                            </TableHead>

                                            <TableHead className="text-right font-semibold text-foreground">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {ingredients.map(
                                            (ingredient, index) => (
                                                <TableRow key={ingredient.id}>
                                                    <TableCell className="text-muted-foreground">
                                                        {index + 1}
                                                    </TableCell>

                                                    <TableCell>
                                                        <span className="font-medium">
                                                            {ingredient.name}
                                                        </span>
                                                    </TableCell>

                                                    <TableCell>
                                                        <span className="text-sm">
                                                            {
                                                                ingredient
                                                                    .category
                                                                    .name
                                                            }
                                                        </span>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm">
                                                                {
                                                                    ingredient
                                                                        .unit
                                                                        .name
                                                                }
                                                            </span>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <span className="text-sm">
                                                            {Number(ingredient.minimum_stock)} {ingredient.unit.symbol}
                                                        </span>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                ingredient.is_active
                                                                    ? 'default'
                                                                    : 'outline'
                                                            }
                                                        >
                                                            {ingredient.is_active
                                                                ? 'Active'
                                                                : 'Inactive'}
                                                        </Badge>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                asChild
                                                                variant="outline"
                                                                size="sm"
                                                            >
                                                                <Link
                                                                    href={`/ingredients/${ingredient.id}/edit`}
                                                                >
                                                                    <Pencil />
                                                                    <span className="hidden sm:inline">
                                                                        Edit
                                                                    </span>
                                                                </Link>
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
                                                </TableRow>
                                            ),
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Delete Confirmation */}
                <AlertDialog
                    open={ingredientToDelete !== null}
                    onOpenChange={(open) => {
                        if (!open && !processing) {
                            setIngredientToDelete(null);
                        }
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Delete ingredient?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                Are you sure you want to delete{' '}
                                <strong>
                                    {ingredientToDelete?.name}
                                </strong>
                                ? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={processing}>
                                Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                                disabled={processing}
                                onClick={handleDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {processing ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );
}