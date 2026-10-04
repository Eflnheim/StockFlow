import { useForm } from '@inertiajs/react';
import { Plus, Save } from 'lucide-react';

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

type Ingredient = {
    id: number;
    name: string;
    unit: {
        id: number;
        name: string;
        symbol: string;
    };
};

type PurchaseItem = {
    id: number;
    ingredient: Ingredient;
    quantity: string;
    unit_price: string;
};

type Props = {
    purchaseOrderId: number;
    ingredients: Ingredient[];
    item?: PurchaseItem | null;
    onSuccess?: () => void;
};

export default function PurchaseItemForm({
    purchaseOrderId,
    ingredients,
    item = null,
    onSuccess,
}: Props) {
    const isEditing = item !== null;

    const { data, setData, post, put, processing, errors, reset } =
        useForm({
            ingredient_id: item ? String(item.ingredient.id) : '',
            quantity: item ? String(Number(item.quantity)) : '',
            unit_price: item ? String(Number(item.unit_price)) : '',
        });

    const selectedIngredient = ingredients.find(
        (ingredient) =>
            String(ingredient.id) === data.ingredient_id,
    );

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        const options = {
            onSuccess: () => {
                reset();
                onSuccess?.();
            },
        };

        if (isEditing) {
            put(
                `/purchase-orders/${purchaseOrderId}/items/${item.id}`,
                options,
            );

            return;
        }

        post(
            `/purchase-orders/${purchaseOrderId}/items`,
            options,
        );
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            {/* Ingredient */}
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
                                {ingredient.name} (
                                {ingredient.unit.symbol})
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <FieldError>
                    {errors.ingredient_id}
                </FieldError>
            </Field>

            {/* Quantity + Unit Price */}
            <div className="grid gap-6 md:grid-cols-2">
                <Field data-invalid={!!errors.quantity}>
                    <FieldLabel htmlFor="quantity">
                        Quantity
                        {selectedIngredient && (
                            <span className="ml-1 text-muted-foreground">
                                ({selectedIngredient.unit.symbol})
                            </span>
                        )}
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
                {processing ? (
                    <Spinner />
                ) : isEditing ? (
                    <Save />
                ) : (
                    <Plus />
                )}

                {isEditing ? 'Save Changes' : 'Add Item'}
            </Button>
        </form>
    );
}
