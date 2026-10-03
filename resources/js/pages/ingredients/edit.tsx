import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import {
    ArrowLeft,
} from 'lucide-react';

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
    FieldGroup,
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

interface Category {
    id: number;
    name: string;
}

interface Unit {
    id: number;
    name: string;
    symbol: string;
}

interface Ingredient {
    id: number;
    ingredient_category_id: number;
    unit_id: number;
    name: string;
    minimum_stock: string;
    is_active: boolean;
}

interface Props {
    ingredient: Ingredient;
    categories: Category[];
    units: Unit[];
}

export default function Edit({
    ingredient,
    categories,
    units,
}: Props) {
    const { data, setData, put, processing, errors } = useForm({
        ingredient_category_id: String(
            ingredient.ingredient_category_id,
        ),
        unit_id: String(ingredient.unit_id),
        name: ingredient.name,
        minimum_stock: String(Number(ingredient.minimum_stock)),
        is_active: ingredient.is_active ? '1' : '0',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        put(`/ingredients/${ingredient.id}`);
    };

    return (
        <>
            <Head title={`Edit ${ingredient.name}`} />

            <div className="mx-auto max-w-2xl space-y-6">
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        asChild
                    >
                        <Link href="/ingredients">
                            <ArrowLeft />
                        </Link>
                    </Button>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Edit Ingredient
                        </h1>

                        <p className="text-sm text-muted-foreground">
                            Update the details of this ingredient.
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Ingredient Details</CardTitle>

                        <CardDescription>
                            Update the ingredient information below.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="space-y-6"
                        >
                            {/* Ingredient Name */}
                            <Field data-invalid={!!errors.name}>
                                <FieldLabel htmlFor="name">
                                    Ingredient Name
                                </FieldLabel>

                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(event) =>
                                        setData(
                                            'name',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="e.g. Mozzarella Cheese"
                                    aria-invalid={!!errors.name}
                                    autoFocus
                                />

                                {errors.name && (
                                    <FieldError>
                                        {errors.name}
                                    </FieldError>
                                )}
                            </Field>

                            {/* Category & Unit */}
                            <FieldGroup className="grid gap-6 md:grid-cols-2">
                                <Field
                                    data-invalid={
                                        !!errors.ingredient_category_id
                                    }
                                >
                                    <FieldLabel htmlFor="ingredient_category_id">
                                        Category
                                    </FieldLabel>

                                    <Select
                                        value={
                                            data.ingredient_category_id
                                        }
                                        onValueChange={(value) =>
                                            setData(
                                                'ingredient_category_id',
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            id="ingredient_category_id"
                                            aria-invalid={
                                                !!errors.ingredient_category_id
                                            }
                                        >
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {categories.map(
                                                (category) => (
                                                    <SelectItem
                                                        key={
                                                            category.id
                                                        }
                                                        value={String(
                                                            category.id,
                                                        )}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>

                                    {errors.ingredient_category_id && (
                                        <FieldError>
                                            {
                                                errors.ingredient_category_id
                                            }
                                        </FieldError>
                                    )}
                                </Field>

                                <Field
                                    data-invalid={
                                        !!errors.unit_id
                                    }
                                >
                                    <FieldLabel htmlFor="unit_id">
                                        Unit
                                    </FieldLabel>

                                    <Select
                                        value={data.unit_id}
                                        onValueChange={(value) =>
                                            setData(
                                                'unit_id',
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            id="unit_id"
                                            aria-invalid={
                                                !!errors.unit_id
                                            }
                                        >
                                            <SelectValue placeholder="Select a unit" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {units.map((unit) => (
                                                <SelectItem
                                                    key={unit.id}
                                                    value={String(
                                                        unit.id,
                                                    )}
                                                >
                                                    {unit.name} (
                                                    {unit.symbol})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {errors.unit_id && (
                                        <FieldError>
                                            {errors.unit_id}
                                        </FieldError>
                                    )}
                                </Field>
                            </FieldGroup>

                            {/* Minimum Stock & Status */}
                            <FieldGroup className="grid gap-6 md:grid-cols-2">
                                <Field
                                    data-invalid={
                                        !!errors.minimum_stock
                                    }
                                >
                                    <FieldLabel htmlFor="minimum_stock">
                                        Minimum Stock
                                    </FieldLabel>

                                    <Input
                                        id="minimum_stock"
                                        type="number"
                                        min="0"
                                        step="0.001"
                                        value={
                                            data.minimum_stock
                                        }
                                        onChange={(event) =>
                                            setData(
                                                'minimum_stock',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="e.g. 10"
                                        aria-invalid={
                                            !!errors.minimum_stock
                                        }
                                    />

                                    {errors.minimum_stock && (
                                        <FieldError>
                                            {
                                                errors.minimum_stock
                                            }
                                        </FieldError>
                                    )}
                                </Field>

                                <Field
                                    data-invalid={
                                        !!errors.is_active
                                    }
                                >
                                    <FieldLabel htmlFor="is_active">
                                        Status
                                    </FieldLabel>

                                    <Select
                                        value={data.is_active}
                                        onValueChange={(value) =>
                                            setData(
                                                'is_active',
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            id="is_active"
                                            aria-invalid={
                                                !!errors.is_active
                                            }
                                        >
                                            <SelectValue />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="1">
                                                Active
                                            </SelectItem>

                                            <SelectItem value="0">
                                                Inactive
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {errors.is_active && (
                                        <FieldError>
                                            {errors.is_active}
                                        </FieldError>
                                    )}
                                </Field>
                            </FieldGroup>

                            {/* Actions */}
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    asChild
                                >
                                    <Link href="/ingredients">
                                        Cancel
                                    </Link>
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing && <Spinner />}

                                    {processing
                                        ? 'Updating'
                                        : 'Update'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}