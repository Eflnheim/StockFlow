import { useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';

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
    item: PurchaseItem;
    onSuccess?: () => void;
};

export default function PurchaseItemEditForm({
    purchaseOrderId,
    item,
    onSuccess,
}: Props) {
    const { data, setData, put, processing, errors } =
        useForm({
            ingredient_id: String(item.ingredient.id),
            quantity: String(Number(item.quantity)),
            unit_price: String(Number(item.unit_price)),
        });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        put(
            `/purchase-orders/${purchaseOrderId}/items/${item.id}`,
            {
                onSuccess: () => {
                    onSuccess?.();
                },
            },
        );
    };

    return (
        <form onSubmit={submit} className="space-y-6">
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
                        value={item.ingredient.unit.symbol}
                        disabled
                    />
                </Field>
            </div>

            {/* Quantity + Unit Price */}
            <div className="grid gap-6 md:grid-cols-2">
                <Field data-invalid={!!errors.quantity}>
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
                        aria-invalid={!!errors.quantity}
                    />

                    <FieldError>
                        {errors.quantity}
                    </FieldError>
                </Field>

                <Field data-invalid={!!errors.unit_price}>
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
                        aria-invalid={!!errors.unit_price}
                    />

                    <FieldError>
                        {errors.unit_price}
                    </FieldError>
                </Field>
            </div>

            <Button type="submit" disabled={processing}>
                {processing ? <Spinner /> : <Save />}
                Save Changes
            </Button>
        </form>
    );
}