import { useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { RecipeIngredient } from '@/types/recipes';

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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Props = {
    recipeId: number;
    ingredients: RecipeIngredient[];
    canEdit: boolean;
    onEdit: (ingredient: RecipeIngredient) => void;
};

function formatNumber(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        maximumFractionDigits: 3,
    }).format(value);
}

export default function RecipeIngredientTable({
    recipeId,
    ingredients,
    canEdit,
    onEdit,
}: Props) {
    const { delete: destroy, processing } = useForm();

    const [ingredientToDelete, setIngredientToDelete] =
        useState<RecipeIngredient | null>(null);

    return (
        <>
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
                                Quantity
                            </TableHead>

                            {canEdit && (
                                <TableHead className="text-right font-semibold text-foreground">
                                    Actions
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {ingredients.map((ingredient, index) => (
                            <TableRow key={ingredient.id}>
                                <TableCell className="text-muted-foreground">
                                    {index + 1}
                                </TableCell>

                                <TableCell className="font-medium">
                                    {ingredient.name}
                                </TableCell>

                                <TableCell className="font-medium">
                                    {formatNumber(
                                        Number(
                                            ingredient.pivot.quantity,
                                        ),
                                    )}
                                    <span>
                                        {' '}
                                        {ingredient.unit.symbol}
                                    </span>
                                </TableCell>

                                {canEdit && (
                                    <TableCell>
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    onEdit(ingredient)
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
                                                disabled={processing}
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
                        ))}
                    </TableBody>
                </Table>
            </div>

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
                            onClick={() => {
                                if (!ingredientToDelete) {
                                    return;
                                }

                                destroy(
                                    `/recipes/${recipeId}/ingredients/${ingredientToDelete.id}`,
                                );

                                setIngredientToDelete(null);
                            }}
                        >
                            {processing ? 'Removing...' : 'Remove'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}