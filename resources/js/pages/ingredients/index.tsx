import { Head, Link, useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { usePermissions } from '@/hooks/use-permissions';
import type { Ingredient } from '@/types/ingredients';

import {
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

import { PageHeader } from '@/components/page-header';
import { IngredientsTable } from '@/components/ingredients/ingredients-table';

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

    const { can } = usePermissions();

    return (
        <>
            <Head title="Ingredients" />

            <div className="space-y-6">
                {/* Page Header */}
                <PageHeader
                    title="Ingredients"
                    description="Manage the ingredients used in inventory."
                >
                    {can('create', 'ingredients') && (
                        <Button asChild>
                            <Link href="/ingredients/create">
                                <Plus />
                                Add Ingredient
                            </Link>
                        </Button>
                    )}
                </PageHeader>

                {/* Ingredients List */}
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
                            managing the inventory.
                        </p>

                        {can('create', 'ingredients') && (
                            <Button asChild>
                                <Link href="/ingredients/create">
                                    <Plus />
                                    Add Ingredient
                                </Link>
                            </Button>
                        )}
                    </div>
                ) : (
                    <IngredientsTable
                        ingredients={ingredients}
                        canUpdate={can('update', 'ingredients')}
                        canDelete={can('delete', 'ingredients')}
                        onDelete={(ingredient) => setIngredientToDelete(ingredient)}
                    />
                )}

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
                                variant="destructive"
                            >
                                { processing && <Spinner /> }
                                {processing ? 'Deleting' : 'Delete'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );
}