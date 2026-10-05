import { useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';

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
import type { PurchaseItem } from '@/types/purchase-orders';

type Props = {
    purchaseOrderId: number;
    item: PurchaseItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function PurchaseItemEditDialog({
    purchaseOrderId,
    item,
    open,
    onOpenChange,
}: Props) {
    const { data, setData, put, processing, errors } =
        useForm({
            ingredient_id: item
                ? String(item.ingredient.id)
                : '',
            quantity: item
                ? String(Number(item.quantity))
                : '',
            unit_price: item
                ? String(Number(item.unit_price))
                : '',
        });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!item) {
            return;
        }

        put(
            `/purchase-orders/${purchaseOrderId}/items/${item.id}`,
            {
                onSuccess: () => {
                    onOpenChange(false);
                },
            },
        );
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent
                className="sm:max-w-xl"
                onOpenAutoFocus={(event) =>
                    event.preventDefault()
                }
            >
                <DialogHeader>
                    <DialogTitle>
                        Edit Purchase Item
                    </DialogTitle>

                    <DialogDescription>
                        Update the quantity or unit price for this
                        purchase item.
                    </DialogDescription>
                </DialogHeader>

                {item && (
                    <form
                        onSubmit={submit}
                        className="space-y-6"
                    >
                        {/* Ingredient + Unit */}
                        <div className="grid gap-6 md:grid-cols-[1fr_140px]">
                            <Field>
                                <FieldLabel htmlFor="ingredient">
                                    Ingredient
                                </FieldLabel>

                                <Input
                                    id="ingredient"
                                    value={item.ingredient.name}
                                    disabled
                                />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="unit">
                                    Unit
                                </FieldLabel>

                                <Input
                                    id="unit"
                                    value={
                                        item.ingredient.unit
                                            .symbol
                                    }
                                    disabled
                                />
                            </Field>
                        </div>

                        {/* Quantity + Unit Price */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <Field
                                data-invalid={
                                    !!errors.quantity
                                }
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
                                    placeholder="e.g. 10"
                                    aria-invalid={
                                        !!errors.quantity
                                    }
                                />

                                <FieldError>
                                    {errors.quantity}
                                </FieldError>
                            </Field>

                            <Field
                                data-invalid={
                                    !!errors.unit_price
                                }
                            >
                                <FieldLabel htmlFor="unit_price">
                                    Unit Price
                                </FieldLabel>

                                <Input
                                    id="unit_price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.unit_price}
                                    onChange={(event) =>
                                        setData(
                                            'unit_price',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="e.g. 15000"
                                    aria-invalid={
                                        !!errors.unit_price
                                    }
                                />

                                <FieldError>
                                    {errors.unit_price}
                                </FieldError>
                            </Field>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    onOpenChange(false)
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
                                    <Save />
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
