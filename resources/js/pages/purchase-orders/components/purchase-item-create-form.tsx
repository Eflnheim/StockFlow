import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Field,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Ingredient } from '@/types/ingredients';

type Props = {
    purchaseOrderId: number;
    ingredients: Ingredient[];
    onSuccess?: () => void;
};

export default function PurchaseItemCreateForm({
    purchaseOrderId,
    ingredients,
    onSuccess,
}: Props) {
    const { data, setData, post, processing, errors, reset } =
        useForm({
            ingredient_id: '',
            quantity: '',
            unit_price: '',
        });

    const selectedIngredient = ingredients.find(
        (ingredient) =>
            String(ingredient.id) === data.ingredient_id,
    );

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post(`/purchase-orders/${purchaseOrderId}/items`, {
            onSuccess: () => {
                reset();
                onSuccess?.();
            },
        });
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            {/* Ingredient + Unit */}
            <div className="grid gap-6 md:grid-cols-[1fr_140px]">
                <Field data-invalid={!!errors.ingredient_id}>
                    <FieldLabel htmlFor="ingredient_id">
                        Ingredient
                    </FieldLabel>

                    <Select
                        value={data.ingredient_id}
                        onValueChange={(value) =>
                            setData('ingredient_id', value)
                        }
                    >
                        <SelectTrigger
                            id="ingredient_id"
                            aria-invalid={!!errors.ingredient_id}
                        >
                            <SelectValue placeholder="Select ingredient" />
                        </SelectTrigger>

                        <SelectContent>
                            {ingredients.map((ingredient) => (
                                <SelectItem
                                    key={ingredient.id}
                                    value={String(ingredient.id)}
                                >
                                    {ingredient.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <FieldError>
                        {errors.ingredient_id}
                    </FieldError>
                </Field>

                <Field>
                    <FieldLabel htmlFor="unit">
                        Unit
                    </FieldLabel>

                    <Input
                        id="unit"
                        value={selectedIngredient?.unit.symbol ?? ''}
                        placeholder="—"
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
                {processing ? <Spinner /> : <Plus />}
                Add Item
            </Button>
        </form>
    );
}