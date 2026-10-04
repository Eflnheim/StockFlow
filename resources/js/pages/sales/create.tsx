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

type Customer = {
    id: number;
    name: string;
};

type Props = {
    customers: Customer[];
};

export default function Create({ customers }: Props) {
    const { data, setData, post, processing, errors } =
        useForm({
            customer_id: '',
            sale_date: new Date()
                .toISOString()
                .slice(0, 16),
            notes: '',
        });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post('/sales');
    };

    return (
        <>
            <Head title="New Sale" />

            <div className="mx-auto max-w-2xl space-y-6">
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="-ml-2"
                >
                    <Link href="/sales">
                        <ArrowLeft />
                        Back to Sales
                    </Link>
                </Button>

                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        New Sale
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Start a new customer sale.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Sale Details</CardTitle>

                        <CardDescription>
                            Enter the basic information for this sale.
                            Items can be added after creating it.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={submit}
                            className="space-y-6"
                        >
                            <Field
                                data-invalid={!!errors.customer_id}
                            >
                                <FieldLabel htmlFor="customer_id">
                                    Customer
                                </FieldLabel>

                                <Select
                                    value={data.customer_id}
                                    onValueChange={(value) =>
                                        setData(
                                            'customer_id',
                                            value,
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        id="customer_id"
                                        aria-invalid={
                                            !!errors.customer_id
                                        }
                                    >
                                        <SelectValue placeholder="Select a customer (optional)" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {customers.map(
                                            (customer) => (
                                                <SelectItem
                                                    key={
                                                        customer.id
                                                    }
                                                    value={String(
                                                        customer.id,
                                                    )}
                                                >
                                                    {customer.name}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>

                                <p className="text-sm text-muted-foreground">
                                    Leave empty for a walk-in customer.
                                </p>

                                <FieldError>
                                    {errors.customer_id}
                                </FieldError>
                            </Field>

                            <Field
                                data-invalid={!!errors.sale_date}
                            >
                                <FieldLabel htmlFor="sale_date">
                                    Sale Date
                                </FieldLabel>

                                <Input
                                    id="sale_date"
                                    type="datetime-local"
                                    value={data.sale_date}
                                    onChange={(event) =>
                                        setData(
                                            'sale_date',
                                            event.target.value,
                                        )
                                    }
                                    aria-invalid={!!errors.sale_date}
                                />

                                <FieldError>
                                    {errors.sale_date}
                                </FieldError>
                            </Field>

                            <Field
                                data-invalid={!!errors.notes}
                            >
                                <FieldLabel htmlFor="notes">
                                    Notes
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
                                    placeholder="Optional notes for this sale"
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
                                    <Link href="/sales">
                                        Cancel
                                    </Link>
                                </Button>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing && <Spinner />}
                                    Create Sale
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
