import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { IngredientCategory } from '@/types/ingredients';

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

interface Props {
    category: IngredientCategory;
}

export default function Edit({ category }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        put(`/ingredient-categories/${category.id}`);
    };

    return (
        <>
            <Head title="Edit Ingredient Category" />

            <div className="mx-auto max-w-2xl space-y-6">
                {/* Page Header */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/ingredient-categories">
                            <ArrowLeft />
                            <span className="sr-only">
                                Back to ingredient categories
                            </span>
                        </Link>
                    </Button>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Edit Ingredient Category
                        </h1>

                        <p className="text-muted-foreground">
                            Update the name of this ingredient category.
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Category Details</CardTitle>

                        <CardDescription>
                            Make changes to the ingredient category below.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="space-y-6"
                        >
                            <Field data-invalid={!!errors.name}>
                                <FieldLabel htmlFor="name">
                                    Category Name
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
                                    placeholder="e.g. Dairy"
                                    aria-invalid={!!errors.name}
                                    autoFocus
                                />

                                {errors.name && (
                                    <FieldError>
                                        {errors.name}
                                    </FieldError>
                                )}
                            </Field>

                            {/* Actions */}
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    asChild
                                >
                                    <Link href="/ingredient-categories">
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