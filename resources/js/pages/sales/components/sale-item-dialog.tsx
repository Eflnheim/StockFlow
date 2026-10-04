import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Field,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

type Recipe = {
    id: number;
    name: string;
    selling_price: string;
};

type Props = {
    saleId: number;
    recipes: Recipe[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

function formatCurrency(value: string | number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value));
}

export function SaleItemDialog({
    saleId,
    recipes,
    open,
    onOpenChange,
}: Props) {
    const { data, setData, post, processing, errors, reset } =
        useForm({
            recipe_id: '',
            quantity: '1',
        });

    const selectedRecipe = recipes.find(
        (recipe) => String(recipe.id) === data.recipe_id,
    );

    useEffect(() => {
        if (!open) {
            reset();
        }
    }, [open, reset]);

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post(`/sales/${saleId}/items`, {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Sale Item</DialogTitle>

                    <DialogDescription>
                        Select a recipe and enter the quantity for this
                        sale.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={submit}
                    className="space-y-6"
                >
                    <Field
                        data-invalid={!!errors.recipe_id}
                    >
                        <FieldLabel htmlFor="recipe_id">
                            Recipe
                        </FieldLabel>

                        <Select
                            value={data.recipe_id}
                            onValueChange={(value) =>
                                setData(
                                    'recipe_id',
                                    value,
                                )
                            }
                        >
                            <SelectTrigger
                                id="recipe_id"
                                aria-invalid={
                                    !!errors.recipe_id
                                }
                            >
                                <SelectValue placeholder="Select a recipe" />
                            </SelectTrigger>

                            <SelectContent>
                                {recipes.map((recipe) => (
                                    <SelectItem
                                        key={recipe.id}
                                        value={String(
                                            recipe.id,
                                        )}
                                    >
                                        {recipe.name} —{' '}
                                        {formatCurrency(
                                            recipe.selling_price,
                                        )}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <FieldError>
                            {errors.recipe_id}
                        </FieldError>
                    </Field>

                    {selectedRecipe && (
                        <div className="rounded-lg border bg-muted/50 p-4">
                            <p className="text-sm text-muted-foreground">
                                Unit Price
                            </p>

                            <p className="mt-1 text-lg font-semibold">
                                {formatCurrency(
                                    selectedRecipe.selling_price,
                                )}
                            </p>
                        </div>
                    )}

                    <Field
                        data-invalid={!!errors.quantity}
                    >
                        <FieldLabel htmlFor="quantity">
                            Quantity
                        </FieldLabel>

                        <Input
                            id="quantity"
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
                            aria-invalid={
                                !!errors.quantity
                            }
                        />

                        <FieldError>
                            {errors.quantity}
                        </FieldError>
                    </Field>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                onOpenChange(false)
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                processing ||
                                recipes.length === 0
                            }
                        >
                            {processing && <Spinner />}
                            Add Item
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
