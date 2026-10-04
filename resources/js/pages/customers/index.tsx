import { Head, Link, useForm } from '@inertiajs/react';
import {
    Mail,
    Pencil,
    Plus,
    Trash2,
    UserRound,
} from 'lucide-react';
import { useState } from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { usePermissions } from '@/hooks/use-permissions';

type Customer = {
    id: number;
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    is_active: boolean;
};

type Props = {
    customers: Customer[];
};

export default function Index({ customers }: Props) {
    const { can } = usePermissions();

    const canCreate = can('create', 'customers');
    const canEdit = can('update', 'customers');
    const canDelete = can('delete', 'customers');

    const [customerToDelete, setCustomerToDelete] =
        useState<Customer | null>(null);

    const {
        delete: destroy,
        processing: deleteProcessing,
    } = useForm();

    return (
        <>
            <Head title="Customers" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Customers
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage customers for your sales transactions.
                        </p>
                    </div>

                    {canCreate && (
                        <Button asChild>
                            <Link href="/customers/create">
                                <Plus />
                                Add Customer
                            </Link>
                        </Button>
                    )}
                </div>

                {customers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                        <div className="mb-4 rounded-full bg-muted p-3">
                            <UserRound className="size-5 text-muted-foreground" />
                        </div>

                        <h3 className="font-medium">
                            No customers yet
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            Add your first customer to start recording
                            sales.
                        </p>

                        {canCreate && (
                            <Button
                                className="mt-4"
                                asChild
                                variant="outline"
                            >
                                <Link href="/customers/create">
                                    <Plus />
                                    Add Customer
                                </Link>
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16 font-semibold text-foreground">
                                        #
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Customer
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Phone
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Email
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Status
                                    </TableHead>

                                    {(canEdit || canDelete) && (
                                        <TableHead className="text-right font-semibold text-foreground">
                                            Actions
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {customers.map(
                                    (customer, index) => (
                                        <TableRow key={customer.id}>
                                            <TableCell className="text-muted-foreground">
                                                {index + 1}
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                                                        <UserRound className="size-4 text-muted-foreground" />
                                                    </div>

                                                    <span className="font-medium">
                                                        {customer.name}
                                                    </span>
                                                </div>
                                            </TableCell>

                                            <TableCell>
                                                {customer.phone ?? (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                {customer.email ? (
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="size-4 text-muted-foreground" />
                                                        <span>
                                                            {
                                                                customer.email
                                                            }
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">
                                                        —
                                                    </span>
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        customer.is_active
                                                            ? 'secondary'
                                                            : 'outline'
                                                    }
                                                >
                                                    {customer.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </Badge>
                                            </TableCell>

                                            {(canEdit ||
                                                canDelete) && (
                                                <TableCell>
                                                    <div className="flex justify-end gap-2">
                                                        {canEdit && (
                                                            <Button
                                                                asChild
                                                                variant="outline"
                                                                size="sm"
                                                            >
                                                                <Link
                                                                    href={`/customers/${customer.id}/edit`}
                                                                >
                                                                    <Pencil />
                                                                    <span className="hidden sm:inline">
                                                                        Edit
                                                                    </span>
                                                                </Link>
                                                            </Button>
                                                        )}

                                                        {canDelete && (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                className="text-destructive hover:text-destructive"
                                                                onClick={() =>
                                                                    setCustomerToDelete(
                                                                        customer,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 />
                                                                <span className="hidden sm:inline">
                                                                    Delete
                                                                </span>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ),
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            <AlertDialog
                open={customerToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setCustomerToDelete(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete customer?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will permanently delete{' '}
                            <span className="font-medium text-foreground">
                                {customerToDelete?.name}
                            </span>
                            . This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            variant="destructive"
                            disabled={deleteProcessing}
                            onClick={() => {
                                if (!customerToDelete) {
                                    return;
                                }

                                destroy(
                                    `/customers/${customerToDelete.id}`,
                                );

                                setCustomerToDelete(null);
                            }}
                        >
                            {deleteProcessing
                                ? 'Deleting...'
                                : 'Delete Customer'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
