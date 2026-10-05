import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { usePermissions } from '@/hooks/use-permissions';
import type { Recipe } from '@/types/recipes';

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
import { PageHeader } from '@/components/page-header';

type Props = {
    recipes: Recipe[];
};

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);
}

export default function Index({ recipes }: Props) {
    const { can } = usePermissions();

    const canCreate = can('create', 'recipes');
    const canEdit = can('update', 'recipes');
    const canDelete = can('delete', 'recipes');

    const { delete: destroy, processing } = useForm();

    const [recipeToDelete, setRecipeToDelete] =
        useState<Recipe | null>(null);

    const canManageRecipes = canEdit || canDelete;

    return (
        <>
            <Head title="Recipes" />

            <div className="space-y-6">
                {/* Page Header */}
                <PageHeader
                    title="Recipes"
                    description="Manage menu recipes and their ingredient compositions."
                >
                    {canCreate && (
                        <Button asChild>
                            <Link href="/recipes/create">
                                <Plus />
                                Add Recipe
                            </Link>
                        </Button>
                    )}
                </PageHeader>

                {recipes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                        <div className="mb-4 rounded-full bg-muted p-3">
                            <Plus className="size-5 text-muted-foreground" />
                        </div>

                        <h3 className="font-medium">
                            No recipes yet
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            Create your first recipe to start managing
                            ingredient compositions.
                        </p>
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
                                        Recipe
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Selling Price
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Status
                                    </TableHead>

                                    {canManageRecipes && (
                                        <TableHead className="text-right font-semibold text-foreground">
                                            Actions
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {recipes.map((recipe, index) => (
                                    <TableRow key={recipe.id}>
                                        <TableCell className="text-muted-foreground">
                                            {index + 1}
                                        </TableCell>

                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {recipe.name}
                                                </div>

                                                {/* {recipe.description && (
                                                    <div className="mt-1 max-w-md truncate text-sm text-muted-foreground">
                                                        {
                                                            recipe.description
                                                        }
                                                    </div>
                                                )} */}
                                            </div>
                                        </TableCell>

                                        <TableCell className="font-medium">
                                            {formatCurrency(
                                                Number(
                                                    recipe.selling_price,
                                                ),
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                className='w-15 text-center'
                                                variant={
                                                    recipe.is_active
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                            >
                                                {recipe.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </TableCell>

                                        {canManageRecipes && (
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Link
                                                            href={`/recipes/${recipe.id}`}
                                                        >
                                                            <Eye />
                                                            <span className="hidden sm:inline">
                                                                View
                                                            </span>
                                                        </Link>
                                                    </Button>

                                                    {canEdit && (
                                                        <Button
                                                            asChild
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <Link
                                                                href={`/recipes/${recipe.id}/edit`}
                                                            >
                                                                <Pencil />
                                                                <span className="hidden sm:inline">
                                                                    Edit
                                                                </span>
                                                            </Link>
                                                        </Button>
                                                    )}

                                                    {canDelete && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() =>
                                                                setRecipeToDelete(
                                                                    recipe,
                                                                )
                                                            }
                                                            disabled={
                                                                processing
                                                            }
                                                        >
                                                            <Trash2 />
                                                            <span className="hidden sm:inline">
                                                                Delete
                                                            </span>
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            <AlertDialog
                open={recipeToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setRecipeToDelete(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete recipe?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will permanently delete{' '}
                            <span className="font-medium text-foreground">
                                {recipeToDelete?.name}
                            </span>
                            . This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            variant="destructive"
                            onClick={() => {
                                if (!recipeToDelete) {
                                    return;
                                }

                                destroy(
                                    `/recipes/${recipeToDelete.id}`,
                                );

                                setRecipeToDelete(null);
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
