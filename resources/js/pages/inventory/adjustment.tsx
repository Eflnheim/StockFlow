import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowDownToLine, ArrowLeft, ArrowUpFromLine } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';

type Ingredient = {
    id: number;
    name: string;
    unit: {
        id: number;
        name: string;
        symbol: string;
    };
};

type Props = {
    ingredients: Ingredient[];
};

export default function Adjustment({
    ingredients,
}: Props) {
    const { data, setData, post, processing, errors } =
        useForm({
            ingredient_id: '',
            type: '',
            quantity: '',
            notes: '',
        });

    const selectedIngredient = ingredients.find(
        (ingredient) =>
            String(ingredient.id) === data.ingredient_id,
    );

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post('/inventory/adjustment');
    };

    return (
        <>
            <Head title="Stock Adjustment" />

            <div className="mx-auto max-w-2xl space-y-6">
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="-ml-2"
                >
                    <Link href="/inventory">
                        <ArrowLeft />
                        Back to Inventory
                    </Link>
                </Button>

                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Stock Adjustment
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Record a manual increase or decrease in stock.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Adjustment Details</CardTitle>

                        <CardDescription>
                            Use this when the physical stock differs from
                            the quantity recorded in the system.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="space-y-6"
                        >
                            <Field
                                data-invalid={
                                    !!errors.ingredient_id
                                }
                            >
                                <FieldLabel htmlFor="ingredient_id">
                                    Ingredient
                                </FieldLabel>

                                <Select
                                    value={data.ingredient_id}
                                    onValueChange={(value) =>
                                        setData(
                                            'ingredient_id',
                                            value,
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        id="ingredient_id"
                                        aria-invalid={
                                            !!errors.ingredient_id
                                        }
                                    >
                                        <SelectValue placeholder="Select ingredient" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {ingredients.map(
                                            (ingredient) => (
                                                <SelectItem
                                                    key={
                                                        ingredient.id
                                                    }
                                                    value={String(
                                                        ingredient.id,
                                                    )}
                                                >
                                                    {
                                                        ingredient.name
                                                    }{' '}
                                                    (
                                                    {
                                                        ingredient
                                                            .unit
                                                            .symbol
                                                    }
                                                    )
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>

                                <FieldError>
                                    {errors.ingredient_id}
                                </FieldError>
                            </Field>

                            <Field
                                data-invalid={!!errors.type}
                            >
                                <FieldLabel htmlFor="type">
                                    Adjustment Type
                                </FieldLabel>

                                <Select
                                    value={data.type}
                                    onValueChange={(value) =>
                                        setData('type', value)
                                    }
                                >
                                    <SelectTrigger
                                        id="type"
                                        aria-invalid={!!errors.type}
                                    >
                                        <SelectValue placeholder="Select adjustment type" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectItem value="adjustment_in">
                                            <div className="flex items-center gap-2">
                                                <ArrowDownToLine />
                                                Stock In
                                            </div>
                                        </SelectItem>

                                        <SelectItem value="adjustment_out">
                                            <div className="flex items-center gap-2">
                                                <ArrowUpFromLine />
                                                Stock Out
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <FieldError>
                                    {errors.type}
                                </FieldError>
                            </Field>

                            <Field
                                data-invalid={!!errors.quantity}
                            >
                                <FieldLabel htmlFor="quantity">
                                    Quantity
                                    {selectedIngredient && (
                                        <span className="ml-1 text-muted-foreground">
                                            (
                                            {
                                                selectedIngredient
                                                    .unit.symbol
                                            }
                                            )
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
                                    placeholder="e.g. 2"
                                    aria-invalid={
                                        !!errors.quantity
                                    }
                                />

                                <FieldError>
                                    {errors.quantity}
                                </FieldError>
                            </Field>

                            <Field
                                data-invalid={!!errors.notes}
                            >
                                <FieldLabel htmlFor="notes">
                                    Reason / Notes
                                </FieldLabel>

                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(event) =>
                                        setData(
                                            'notes',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="e.g. Physical stock count adjustment"
                                    rows={4}
                                    aria-invalid={!!errors.notes}
                                />

                                <FieldError>
                                    {errors.notes}
                                </FieldError>
                            </Field>

                            <div className="flex justify-end gap-2">
                                <Button
                                    asChild
                                    type="button"
                                    variant="outline"
                                >
                                    <Link href="/inventory">
                                        Cancel
                                    </Link>
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing && <Spinner />}
                                    Record Adjustment
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
