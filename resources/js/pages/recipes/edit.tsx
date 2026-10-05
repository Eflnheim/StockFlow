import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { Recipe } from '@/types/recipes';

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    recipe: Recipe;
};

export default function Edit({ recipe }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: recipe.name,
        selling_price: String(
            Number(recipe.selling_price),
        ),
        is_active: recipe.is_active ? '1' : '0',
        description: recipe.description ?? '',
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        put(`/recipes/${recipe.id}`);
    };

    return (
        <>
            <Head title={`Edit ${recipe.name}`} />

            <div className="mx-auto max-w-2xl space-y-6">
                {/* Page Header */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/recipes/${recipe.id}`}>
                            <ArrowLeft />
                            <span className="sr-only">
                                Back to Recipe
                            </span>
                        </Link>
                    </Button>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Edit Recipe
                        </h1>

                        <p className="text-muted-foreground">
                            Update the details for this recipe.
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recipe Details</CardTitle>

                        <CardDescription>
                            Modify the recipe information below.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="space-y-6"
                        >
                            <Field
                                data-invalid={!!errors.name}
                            >
                                <FieldLabel htmlFor="name">
                                    Recipe Name
                                </FieldLabel>

                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(event) =>
                                        setData(
                                            'name',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="e.g. Chicken Rice Bowl"
                                    aria-invalid={!!errors.name}
                                />

                                <FieldError>
                                    {errors.name}
                                </FieldError>
                            </Field>

                            <div className="grid gap-6 md:grid-cols-2">
                                <Field
                                    data-invalid={
                                        !!errors.selling_price
                                    }
                                >
                                    <FieldLabel htmlFor="selling_price">
                                        Selling Price
                                    </FieldLabel>

                                    <Input
                                        id="selling_price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={
                                            data.selling_price
                                        }
                                        onChange={(event) =>
                                            setData(
                                                'selling_price',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="e.g. 25000"
                                        aria-invalid={
                                            !!errors.selling_price
                                        }
                                    />

                                    <FieldError>
                                        {errors.selling_price}
                                    </FieldError>
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

                                    <FieldError>
                                        {errors.is_active}
                                    </FieldError>
                                </Field>
                            </div>

                            <Field
                                data-invalid={
                                    !!errors.description
                                }
                            >
                                <FieldLabel htmlFor="description">
                                    Description
                                </FieldLabel>

                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(event) =>
                                        setData(
                                            'description',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Optional description for this recipe"
                                    rows={4}
                                    aria-invalid={
                                        !!errors.description
                                    }
                                />

                                <FieldError>
                                    {errors.description}
                                </FieldError>
                            </Field>

                            <div className="flex justify-end gap-2">
                                <Button
                                    asChild
                                    type="button"
                                    variant="outline"
                                >
                                    <Link
                                        href={`/recipes/${recipe.id}`}
                                    >
                                        Cancel
                                    </Link>
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing && <Spinner />}

                                    {processing
                                        ? 'Saving'
                                        : 'Save'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
