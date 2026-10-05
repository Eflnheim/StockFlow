import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { usePermissions } from '@/hooks/use-permissions';
import type { Supplier } from '@/types/suppliers';

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
import { Spinner } from '@/components/ui/spinner';

import { PageHeader } from '@/components/page-header';

interface Props {
    suppliers: Supplier[];
}

export default function Index({ suppliers }: Props) {
    const { delete: destroy, processing } = useForm();

    const [supplierToDelete, setSupplierToDelete] =
        useState<Supplier | null>(null);

    const handleDelete = (event: FormEvent) => {
        event.preventDefault();

        if (!supplierToDelete) {
            return;
        }

        destroy(`/suppliers/${supplierToDelete.id}`, {
            onSuccess: () =>
                setSupplierToDelete(null),
        });
    };

    const { can } = usePermissions();

    const canManageSuppliers =
        can('update', 'suppliers') ||
        can('delete', 'suppliers');

    return (
        <>
            <Head title="Suppliers" />

            <div className="space-y-6">
                {/* Page Header */}
                <PageHeader
                    title="Suppliers"
                    description="Manage the suppliers that provide ingredients."
                >
                    {can('create', 'suppliers') && (
                        <Button asChild>
                            <Link href="/suppliers/create">
                                <Plus />
                                Add Supplier
                            </Link>
                        </Button>
                    )}
                </PageHeader>

                {/* Supplier List */}
                {suppliers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                        <div className="mb-4 rounded-full bg-muted p-3">
                            <Plus className="size-5 text-muted-foreground" />
                        </div>

                        <h3 className="font-medium">
                            No suppliers yet
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            Add your first supplier to start managing
                            ingredient purchases.
                        </p>

                        {can('create', 'suppliers') && (
                            <Button asChild>
                                <Link href="/suppliers/create">
                                    <Plus />
                                    Add Supplier
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
                                        Supplier
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Contact
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Email
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Status
                                    </TableHead>

                                    {canManageSuppliers && (
                                        <TableHead className="text-right font-semibold text-foreground">
                                            Actions
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {suppliers.map((supplier, index) => (
                                    <TableRow key={supplier.id}>
                                        <TableCell className="text-muted-foreground">
                                            {index + 1}
                                        </TableCell>

                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium">
                                                    {supplier.name}
                                                </span>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            <div>
                                                <p>
                                                    {supplier.contact_person ?? '-'}
                                                </p>

                                                {supplier.phone && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {supplier.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {supplier.email ?? '-'}
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                className="w-15 text-center"
                                                variant={
                                                    supplier.is_active
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                            >
                                                {supplier.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </TableCell>

                                        {canManageSuppliers && (
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    {can('update', 'suppliers') && (
                                                        <Button
                                                            asChild
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <Link
                                                                href={`/suppliers/${supplier.id}/edit`}
                                                            >
                                                                <Pencil />
                                                                <span className="hidden sm:inline">
                                                                    Edit
                                                                </span>
                                                            </Link>
                                                        </Button>
                                                    )}

                                                    {can('delete', 'suppliers') && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() =>
                                                                setSupplierToDelete(
                                                                    supplier,
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
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Delete Confirmation */}
                <AlertDialog
                    open={!!supplierToDelete}
                    onOpenChange={(open) => {
                        if (!open) {
                            setSupplierToDelete(null);
                        }
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Delete supplier?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                This will permanently delete{' '}
                                <span className="font-medium">
                                    {supplierToDelete?.name}
                                </span>
                                . This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={processing}>
                                Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                                onClick={handleDelete}
                                disabled={processing}
                                variant="destructive"
                            >
                                {processing && <Spinner />}
                                {processing ? 'Deleting' : 'Delete'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );
}