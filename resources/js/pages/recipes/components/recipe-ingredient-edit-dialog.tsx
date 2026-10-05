import { useForm } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { useEffect } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import type { RecipeIngredient } from '@/types/recipes';

type Props = {
    recipeId: number;
    ingredient: RecipeIngredient | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function RecipeIngredientEditDialog({
    recipeId,
    ingredient,
    open,
    onOpenChange,
}: Props) {
    const { data, setData, put, processing, errors, reset } =
        useForm({
            quantity: '',
        });

    useEffect(() => {
        if (ingredient) {
            setData(
                'quantity',
                String(Number(ingredient.pivot.quantity)),
            );
        }
    }, [ingredient, setData]);

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!ingredient) {
            return;
        }

        put(
            `/recipes/${recipeId}/ingredients/${ingredient.id}`,
            {
                onSuccess: () => {
                    reset();
                    onOpenChange(false);
                },
            },
        );
    };

    const handleOpenChange = (value: boolean) => {
        if (!value && !processing) {
            reset();
        }

        onOpenChange(value);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit Ingredient
                    </DialogTitle>

                    <DialogDescription>
                        Update the quantity required for one serving.
                    </DialogDescription>
                </DialogHeader>

                {ingredient && (
                    <form
                        onSubmit={submit}
                        className="space-y-6"
                    >
                        <div className="rounded-lg border bg-muted/50 p-3">
                            <p className="text-sm font-medium">
                                {ingredient.name}
                            </p>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Unit: {ingredient.unit.symbol}
                            </p>
                        </div>

                        <Field
                            data-invalid={!!errors.quantity}
                        >
                            <FieldLabel htmlFor="edit-quantity">
                                Quantity
                            </FieldLabel>

                            <div className="relative">
                                <Input
                                    id="edit-quantity"
                                    type="number"
                                    min="0.001"
                                    step="0.001"
                                    value={data.quantity}
                                    onChange={(event) =>
                                        setData(
                                            'quantity',
                                            event.target.value,
                                        )
                                    }
                                    className="pr-14"
                                    aria-invalid={
                                        !!errors.quantity
                                    }
                                />

                                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                    {ingredient.unit.symbol}
                                </span>
                            </div>

                            <FieldError>
                                {errors.quantity}
                            </FieldError>
                        </Field>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    handleOpenChange(false)
                                }
                                disabled={processing}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? (
                                    <Spinner />
                                ) : (
                                    <Pencil />
                                )}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
