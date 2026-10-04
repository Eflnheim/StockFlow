import { Head, Link, useForm } from '@inertiajs/react';
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

export default function Create() {
    const { data, setData, post, processing, errors } =
        useForm({
            name: '',
            phone: '',
            email: '',
            address: '',
            is_active: '1',
        });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post('/customers');
    };

    return (
        <>
            <Head title="Create Customer" />

            <div className="mx-auto max-w-2xl space-y-6">
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="-ml-2"
                >
                    <Link href="/customers">
                        <ArrowLeft />
                        Back to Customers
                    </Link>
                </Button>

                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create Customer
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Add a new customer to your customer list.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Customer Details</CardTitle>

                        <CardDescription>
                            Enter the customer's contact information.
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
                                    Name
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
                                    placeholder="e.g. John Doe"
                                    aria-invalid={!!errors.name}
                                />

                                <FieldError>
                                    {errors.name}
                                </FieldError>
                            </Field>

                            <div className="grid gap-6 md:grid-cols-2">
                                <Field
                                    data-invalid={!!errors.phone}
                                >
                                    <FieldLabel htmlFor="phone">
                                        Phone
                                    </FieldLabel>

                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(event) =>
                                            setData(
                                                'phone',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="e.g. 081234567890"
                                        aria-invalid={!!errors.phone}
                                    />

                                    <FieldError>
                                        {errors.phone}
                                    </FieldError>
                                </Field>

                                <Field
                                    data-invalid={!!errors.email}
                                >
                                    <FieldLabel htmlFor="email">
                                        Email
                                    </FieldLabel>

                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(event) =>
                                            setData(
                                                'email',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="e.g. john@example.com"
                                        aria-invalid={!!errors.email}
                                    />

                                    <FieldError>
                                        {errors.email}
                                    </FieldError>
                                </Field>
                            </div>

                            <Field
                                data-invalid={!!errors.address}
                            >
                                <FieldLabel htmlFor="address">
                                    Address
                                </FieldLabel>

                                <Textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(event) =>
                                        setData(
                                            'address',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Optional customer address"
                                    rows={4}
                                    aria-invalid={!!errors.address}
                                />

                                <FieldError>
                                    {errors.address}
                                </FieldError>
                            </Field>

                            <Field
                                data-invalid={!!errors.is_active}
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

                            <div className="flex justify-end gap-2">
                                <Button
                                    asChild
                                    type="button"
                                    variant="outline"
                                >
                                    <Link href="/customers">
                                        Cancel
                                    </Link>
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing && <Spinner />}
                                    Create Customer
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
