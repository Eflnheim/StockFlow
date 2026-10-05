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
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        contact_person: '',
        phone: '',
        email: '',
        address: '',
        is_active: '1',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        post('/suppliers');
    };

    return (
        <>
            <Head title="Create Supplier" />

            <div className="mx-auto max-w-2xl space-y-6">
                {/* Page Header */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/suppliers">
                            <ArrowLeft />
                            <span className="sr-only">
                                Back to suppliers
                            </span>
                        </Link>
                    </Button>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create Supplier
                        </h1>

                        <p className="text-muted-foreground">
                            Add a new supplier for your ingredients.
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Supplier Details</CardTitle>

                        <CardDescription>
                            Enter the supplier's contact and business
                            information.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="space-y-6"
                        >
                            <div className="space-y-6">
                                {/* Supplier Name */}
                                <Field data-invalid={!!errors.name}>
                                    <FieldLabel htmlFor="name">
                                        Supplier Name
                                    </FieldLabel>

                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(event) =>
                                            setData('name', event.target.value)
                                        }
                                        placeholder="e.g. Fresh Food Supplier"
                                        aria-invalid={!!errors.name}
                                    />

                                    {errors.name && (
                                        <FieldError>
                                            {errors.name}
                                        </FieldError>
                                    )}
                                </Field>

                                {/* Contact Person + Phone */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    <Field data-invalid={!!errors.contact_person}>
                                        <FieldLabel htmlFor="contact_person">
                                            Contact Person
                                        </FieldLabel>

                                        <Input
                                            id="contact_person"
                                            type="text"
                                            value={data.contact_person}
                                            onChange={(event) =>
                                                setData(
                                                    'contact_person',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="e.g. John Doe"
                                            aria-invalid={!!errors.contact_person}
                                        />

                                        {errors.contact_person && (
                                            <FieldError>
                                                {errors.contact_person}
                                            </FieldError>
                                        )}
                                    </Field>

                                    <Field data-invalid={!!errors.phone}>
                                        <FieldLabel htmlFor="phone">
                                            Phone
                                        </FieldLabel>

                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={data.phone}
                                            onChange={(event) =>
                                                setData('phone', event.target.value)
                                            }
                                            placeholder="e.g. 081234567890"
                                            aria-invalid={!!errors.phone}
                                        />

                                        {errors.phone && (
                                            <FieldError>
                                                {errors.phone}
                                            </FieldError>
                                        )}
                                    </Field>
                                </div>

                                {/* Email + Status */}
                                <div className="grid gap-6 md:grid-cols-2">
                                    <Field data-invalid={!!errors.email}>
                                        <FieldLabel htmlFor="email">
                                            Email
                                        </FieldLabel>

                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(event) =>
                                                setData('email', event.target.value)
                                            }
                                            placeholder="supplier@example.com"
                                            aria-invalid={!!errors.email}
                                        />

                                        {errors.email && (
                                            <FieldError>
                                                {errors.email}
                                            </FieldError>
                                        )}
                                    </Field>

                                    <Field data-invalid={!!errors.is_active}>
                                        <FieldLabel htmlFor="is_active">
                                            Status
                                        </FieldLabel>

                                        <Select
                                            value={data.is_active}
                                            onValueChange={(value) =>
                                                setData('is_active', value)
                                            }
                                        >
                                            <SelectTrigger
                                                id="is_active"
                                                aria-invalid={!!errors.is_active}
                                            >
                                                <SelectValue placeholder="Select status" />
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
                                </div>

                                {/* Address */}
                                <Field data-invalid={!!errors.address}>
                                    <FieldLabel htmlFor="address">
                                        Address
                                    </FieldLabel>

                                    <Textarea
                                        id="address"
                                        value={data.address}
                                        onChange={(event) =>
                                            setData('address', event.target.value)
                                        }
                                        placeholder="Enter supplier address..."
                                        aria-invalid={!!errors.address}
                                        rows={4}
                                    />

                                    {errors.address && (
                                        <FieldError>
                                            {errors.address}
                                        </FieldError>
                                    )}
                                </Field>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    asChild
                                >
                                    <Link href="/suppliers">
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