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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

type Supplier = {
    id: number;
    name: string;
};

type Props = {
    suppliers: Supplier[];
};

export default function Create({ suppliers }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        order_date: '',
        notes: '',
    });

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post('/purchase-orders');
    };

    return (
        <>
            <Head title="Create Purchase Order" />

            <div className="mx-auto max-w-2xl space-y-6">
                {/* Page Header */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/purchase-orders">
                            <ArrowLeft />
                            <span className="sr-only">
                                Back to purchase orders
                            </span>
                        </Link>
                    </Button>

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Create Purchase Order
                        </h1>

                        <p className="text-muted-foreground">
                            Create a new purchase order for your supplier.
                        </p>
                    </div>
                </div>

                {/* Form Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Purchase Order Details</CardTitle>

                        <CardDescription>
                            Enter the supplier and basic information for this
                            purchase order.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Supplier + Order Date */}
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* Supplier */}
                                <Field data-invalid={!!errors.supplier_id}>
                                    <FieldLabel htmlFor="supplier_id">
                                        Supplier
                                    </FieldLabel>

                                    <Select
                                        value={data.supplier_id}
                                        onValueChange={(value) =>
                                            setData('supplier_id', value)
                                        }
                                    >
                                        <SelectTrigger
                                            id="supplier_id"
                                            aria-invalid={!!errors.supplier_id}
                                        >
                                            <SelectValue placeholder="Select a supplier" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {suppliers.map((supplier) => (
                                                <SelectItem
                                                    key={supplier.id}
                                                    value={String(supplier.id)}
                                                >
                                                    {supplier.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {errors.supplier_id && (
                                        <FieldError>
                                            {errors.supplier_id}
                                        </FieldError>
                                    )}
                                </Field>

                                {/* Order Date */}
                                <Field data-invalid={!!errors.order_date}>
                                    <FieldLabel htmlFor="order_date">
                                        Order Date
                                    </FieldLabel>

                                    <input
                                        id="order_date"
                                        type="date"
                                        value={data.order_date}
                                        onChange={(event) =>
                                            setData(
                                                'order_date',
                                                event.target.value,
                                            )
                                        }
                                        aria-invalid={!!errors.order_date}
                                        className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />

                                    {errors.order_date && (
                                        <FieldError>
                                            {errors.order_date}
                                        </FieldError>
                                    )}
                                </Field>
                            </div>

                            {/* Notes */}
                            <Field data-invalid={!!errors.notes}>
                                <FieldLabel htmlFor="notes">
                                    Notes
                                </FieldLabel>

                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(event) =>
                                        setData('notes', event.target.value)
                                    }
                                    placeholder="Add any additional notes for this purchase order..."
                                    aria-invalid={!!errors.notes}
                                    rows={4}
                                />

                                {errors.notes && (
                                    <FieldError>
                                        {errors.notes}
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
                                    <Link href="/purchase-orders">
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
