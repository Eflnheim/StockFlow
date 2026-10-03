import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { ArrowLeft } from 'lucide-react';

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

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        symbol: '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post('/units');
    };

    return (
        <>
            <Head title="Create Unit" />

            <div className="mx-auto max-w-2xl space-y-6">
                {/* Page Header */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/units">
                            <ArrowLeft />
                            <span className="sr-only">
                                Back to units
                            </span>
                        </Link>
                    </Button>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create Unit
                        </h1>

                        <p className="text-muted-foreground">
                            Add a new measurement unit for your ingredients.
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Unit Details</CardTitle>

                        <CardDescription>
                            Enter the name and symbol for the new unit.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="space-y-6"
                        >
                            {/* Unit Name & Symbol */}
                            <FieldGroup className="grid gap-6 md:grid-cols-2">
                                <Field data-invalid={!!errors.name}>
                                    <FieldLabel htmlFor="name">
                                        Unit Name
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
                                        placeholder="e.g. Kilogram"
                                        aria-invalid={!!errors.name}
                                        autoFocus
                                    />

                                    {errors.name && (
                                        <FieldError>
                                            {errors.name}
                                        </FieldError>
                                    )}
                                </Field>

                                <Field data-invalid={!!errors.symbol}>
                                    <FieldLabel htmlFor="symbol">
                                        Symbol
                                    </FieldLabel>

                                    <Input
                                        id="symbol"
                                        type="text"
                                        value={data.symbol}
                                        onChange={(event) =>
                                            setData(
                                                'symbol',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="e.g. kg"
                                        aria-invalid={!!errors.symbol}
                                    />

                                    {errors.symbol && (
                                        <FieldError>
                                            {errors.symbol}
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
                                    <Link href="/units">
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