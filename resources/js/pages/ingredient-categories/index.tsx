import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';
import type { IngredientCategory } from '@/types/ingredients';

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
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { PageHeader } from '@/components/page-header';

interface Props {
    categories: IngredientCategory[];
}

export default function Index({ categories }: Props) {
    const { delete: destroy, processing } = useForm();

    const [categoryToDelete, setCategoryToDelete] =
        useState<IngredientCategory | null>(null);

    const handleDelete = () => {
        if (!categoryToDelete) {
            return;
        }

        destroy(`/ingredient-categories/${categoryToDelete.id}`, {
            onSuccess: () => {
                setCategoryToDelete(null);
            },
        });
    };

    const { can } = usePermissions();

    const canManageCategories =
        can('update', 'ingredient-categories') ||
        can('delete', 'ingredient-categories');

    return (
        <>
            <Head title="Ingredient Categories" />

            <div className="space-y-6">
                {/* Page Header */}
                <PageHeader
                    title="Ingredient Categories"
                    description="Manage the categories used to organize ingredients."
                >
                    {can('create', 'ingredient-categories') && (
                        <Button asChild>
                            <Link href="/ingredient-categories/create">
                                <Plus />
                                Add Category
                            </Link>
                        </Button>
                    )}
                </PageHeader>

                {/* List of Categories */}
                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                        <div className="mb-4 rounded-full bg-muted p-3">
                            <Plus className="size-5 text-muted-foreground" />
                        </div>

                        <h3 className="font-medium">
                            No categories yet
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            Create your first ingredient category to
                            start organizing your inventory.
                        </p>

                        {can('create', 'ingredient-categories') && (
                            <Button asChild>
                                <Link href="/ingredient-categories/create">
                                    <Plus />
                                    Add Category
                                </Link>
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
                                        Category
                                    </TableHead>

                                    {canManageCategories && (
                                        <TableHead className="text-right font-semibold text-foreground">
                                            Actions
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {categories.map(
                                    (category, index) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="text-muted-foreground">
                                                {index + 1}
                                            </TableCell>

                                            <TableCell>
                                                <span className="font-medium">
                                                    {category.name}
                                                </span>
                                            </TableCell>
                                            {canManageCategories && (
                                                <TableCell>
                                                    <div className="flex justify-end gap-2">
                                                        {can('update', 'ingredient-categories') && (
                                                            <Button
                                                                asChild
                                                                variant="outline"
                                                                size="sm"
                                                            >
                                                                <Link
                                                                    href={`/ingredient-categories/${category.id}/edit`}
                                                                >
                                                                    <Pencil />
                                                                    <span className="hidden sm:inline">
                                                                        Edit
                                                                    </span>
                                                                </Link>
                                                            </Button>
                                                        )}

                                                        {can('delete', 'ingredient-categories') && (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-destructive hover:text-destructive"
                                                                onClick={() =>
                                                                    setCategoryToDelete(category)
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
                                    ),
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Delete Confirmation */}
                <AlertDialog
                    open={categoryToDelete !== null}
                    onOpenChange={(open) => {
                        if (!open && !processing) {
                            setCategoryToDelete(null);
                        }
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Delete ingredient category?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                Are you sure you want to delete{' '}
                                <strong>{categoryToDelete?.name}</strong>?
                                This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={processing}>
                                Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                                disabled={processing}
                                onClick={handleDelete}
                                variant="destructive"
                            >
                                {processing && <Spinner />}
                                {processing ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );
}