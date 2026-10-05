import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, Plus, Trash2, Pencil } from 'lucide-react';
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
import { PageHeader } from '@/components/page-header';
import type { Sale } from '@/types/sales';

type Props = {
    sales: Sale[];
};

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
    }).format(new Date(value));
}

function formatStatus(status: string): string {
    return status
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function Index({ sales }: Props) {
    const { can } = usePermissions();

    const canCreate = can('create', 'sales');
    const canEdit = can('update', 'sales');
    const canDelete = can('delete', 'sales');

    const [saleToDelete, setSaleToDelete] =
        useState<Sale | null>(null);

    const {
        delete: destroy,
        processing: deleteProcessing,
    } = useForm();

    return (
        <>
            <Head title="Sales" />

            <div className="space-y-6">
                <PageHeader
                    title="Sales"
                    description="Manage customer sales and transactions."
                >
                    {canCreate && (
                        <Button asChild>
                            <Link href="/sales/create">
                                <Plus />
                                New Sale
                            </Link>
                        </Button>
                    )}
                </PageHeader>

                {sales.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                        <div className="mb-4 rounded-full bg-muted p-3">
                            <Plus className="size-5 text-muted-foreground" />
                        </div>

                        <h3 className="font-medium">
                            No sales yet
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            Record your first sale to start tracking
                            transactions.
                        </p>

                        {canCreate && (
                            <Button
                                className="mt-4"
                                asChild
                                variant="outline"
                            >
                                <Link href="/sales/create">
                                    <Plus />
                                    New Sale
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
                                        Invoice
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Customer
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Date
                                    </TableHead>

                                    <TableHead className="text-right font-semibold text-foreground">
                                        Total
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Status
                                    </TableHead>

                                    <TableHead className="text-right font-semibold text-foreground">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {sales.map((sale, index) => (
                                    <TableRow key={sale.id}>
                                        <TableCell className="text-muted-foreground">
                                            {index + 1}
                                        </TableCell>

                                        <TableCell className="font-medium font-mono">
                                            {sale.invoice_number}
                                        </TableCell>

                                        <TableCell>
                                            {sale.customer?.name ?? (
                                                <span className="text-muted-foreground">
                                                    Walk-in Customer
                                                </span>
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            {formatDate(
                                                sale.sale_date,
                                            )}
                                        </TableCell>

                                        <TableCell className="text-right font-medium">
                                            {formatCurrency(
                                                Number(
                                                    sale.total_amount,
                                                ),
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <Badge variant="secondary">
                                                {formatStatus(
                                                    sale.status,
                                                )}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    <Link
                                                        href={`/sales/${sale.id}`}
                                                    >
                                                        <Eye />
                                                        <span className="hidden sm:inline">
                                                            View
                                                        </span>
                                                    </Link>
                                                </Button>

                                                {canEdit && sale.status === 'pending' && (
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Link href={`/sales/${sale.id}/edit`}>
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
                                                            setSaleToDelete(
                                                                sale,
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
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            <AlertDialog
                open={saleToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSaleToDelete(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete sale?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will permanently delete sale{' '}
                            <span className="font-medium text-foreground">
                                {saleToDelete?.invoice_number}
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
                                if (!saleToDelete) {
                                    return;
                                }

                                destroy(
                                    `/sales/${saleToDelete.id}`,
                                );

                                setSaleToDelete(null);
                            }}
                        >
                            {deleteProcessing
                                ? 'Deleting...'
                                : 'Delete Sale'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
