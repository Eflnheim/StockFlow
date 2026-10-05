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
import { Spinner } from '@/components/ui/spinner';
import type { SaleItem } from '@/types/sales';

type Props = {
    saleId: number;
    item: SaleItem | null;
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

export function SaleItemEditDialog({
    saleId,
    item,
    open,
    onOpenChange,
}: Props) {
    const { data, setData, put, processing, errors, reset } =
        useForm({
            quantity: '',
        });

    useEffect(() => {
        if (open && item) {
            setData(
                'quantity',
                String(Number(item.quantity)),
            );
        }

        if (!open) {
            reset();
        }
    }, [open, item]);

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!item) {
            return;
        }

        put(`/sales/${saleId}/items/${item.id}`, {
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
                    <DialogTitle>
                        Edit Sale Item
                    </DialogTitle>

                    <DialogDescription>
                        Update the quantity for this sale item.
                    </DialogDescription>
                </DialogHeader>

                {item && (
                    <form
                        onSubmit={submit}
                        className="space-y-6"
                    >
                        <div className="rounded-lg border bg-muted/50 p-4">
                            <p className="text-sm text-muted-foreground">
                                Recipe
                            </p>

                            <p className="mt-1 font-medium">
                                {item.recipe.name}
                            </p>

                            <p className="mt-3 text-sm text-muted-foreground">
                                Unit Price
                            </p>

                            <p className="mt-1 font-semibold">
                                {formatCurrency(
                                    item.unit_price,
                                )}
                            </p>
                        </div>

                        <Field
                            data-invalid={!!errors.quantity}
                        >
                            <FieldLabel htmlFor="edit_quantity">
                                Quantity
                            </FieldLabel>

                            <Input
                                id="edit_quantity"
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
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
