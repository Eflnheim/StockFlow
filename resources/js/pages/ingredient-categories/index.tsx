import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';
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
    created_at: string;
    updated_at: string;
}

interface Props {
    categories: Category[];
}

export default function Index({ categories }: Props) {
    const { delete: destroy, processing } = useForm();

    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

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
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Ingredient Categories
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage the categories used to organize ingredients.
                        </p>
                    </div>

                    {can('create', 'ingredient-categories') && (
                        <Button asChild>
                            <Link href="/ingredient-categories/create">
                                <Plus />
                                Add Category
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Categories Card */}
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
                                                <div className="flex items-center gap-3">
                                                    <span className="font-medium">
                                                        {category.name}
                                                    </span>
                                                </div>
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