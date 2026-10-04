import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { usePermissions } from '@/hooks/use-permissions';

type Supplier = {
    id: number;
    name: string;
};

type PurchaseOrder = {
    id: number;
    supplier: Supplier;
    order_number: string;
    order_date: string;
    status: 'pending' | 'received' | 'cancelled';
    notes: string | null;
};

type Props = {
    purchaseOrders: PurchaseOrder[];
};

export default function Index({ purchaseOrders }: Props) {
    const { can } = usePermissions();

    const canManagePurchaseOrders =
        can('update', 'purchase-orders') ||
        can('delete', 'purchase-orders');

    const { delete: destroy } = useForm();

    const [purchaseOrderToDelete, setPurchaseOrderToDelete] =
        useState<PurchaseOrder | null>(null);

    return (
        <>
            <Head title="Purchase Orders" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Purchase Orders
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage ingredient purchases from your suppliers.
                        </p>
                    </div>

                    {can('create', 'purchase-orders') && (
                        <Button asChild>
                            <Link href="/purchase-orders/create">
                                <Plus />
                                Add Purchase Order
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Purchase Order List */}
                {purchaseOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                        <div className="mb-4 rounded-full bg-muted p-3">
                            <Plus className="size-5 text-muted-foreground" />
                        </div>

                        <h3 className="font-medium">
                            No purchase orders yet
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            Create your first purchase order to start
                            recording ingredient purchases.
                        </p>

                        {can('create', 'purchase-orders') && (
                            <Button asChild className="mt-4">
                                <Link href="/purchase-orders/create">
                                    <Plus />
                                    Add Purchase Order
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
                                        Order Number
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Supplier
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Order Date
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Status
                                    </TableHead>

                                    {canManagePurchaseOrders && (
                                        <TableHead className="text-right font-semibold text-foreground">
                                            Actions
                                        </TableHead>
                                    )}
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {purchaseOrders.map(
                                    (purchaseOrder, index) => (
                                        <TableRow key={purchaseOrder.id}>
                                            <TableCell className="text-muted-foreground">
                                                {index + 1}
                                            </TableCell>

                                            <TableCell>
                                                <Link
                                                    href={`/purchase-orders/${purchaseOrder.id}`}
                                                    className="font-medium hover:underline"
                                                >
                                                    {
                                                        purchaseOrder.order_number
                                                    }
                                                </Link>
                                            </TableCell>

                                            <TableCell>
                                                {
                                                    purchaseOrder.supplier
                                                        .name
                                                }
                                            </TableCell>

                                            <TableCell>
                                                {new Date(
                                                    purchaseOrder.order_date,
                                                ).toLocaleDateString(
                                                    'en-US',
                                                    {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    },
                                                )}
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        purchaseOrder.status ===
                                                            'pending'
                                                            ? 'secondary'
                                                            : purchaseOrder.status ===
                                                                'received'
                                                                ? 'default'
                                                                : 'outline'
                                                    }
                                                >
                                                    {purchaseOrder.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        purchaseOrder.status.slice(
                                                            1,
                                                        )}
                                                </Badge>
                                            </TableCell>

                                            {canManagePurchaseOrders && (
                                                <TableCell>
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            asChild
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <Link href={`/purchase-orders/${purchaseOrder.id}`}>
                                                                <Eye />
                                                                <span className="hidden sm:inline">View</span>
                                                            </Link>
                                                        </Button>
                                                        {can(
                                                            'update',
                                                            'purchase-orders',
                                                        ) &&
                                                            purchaseOrder.status ===
                                                            'pending' && (
                                                                <Button
                                                                    asChild
                                                                    variant="outline"
                                                                    size="sm"
                                                                >
                                                                    <Link
                                                                        href={`/purchase-orders/${purchaseOrder.id}/edit`}
                                                                    >
                                                                        <Pencil />
                                                                        <span className="hidden sm:inline">
                                                                            Edit
                                                                        </span>
                                                                    </Link>
                                                                </Button>
                                                            )}

                                                        {can(
                                                            'delete',
                                                            'purchase-orders',
                                                        ) &&
                                                            purchaseOrder.status ===
                                                            'pending' && (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="sm"
                                                                    className="text-destructive hover:text-destructive"
                                                                    onClick={() =>
                                                                        setPurchaseOrderToDelete(
                                                                            purchaseOrder,
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
                open={purchaseOrderToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setPurchaseOrderToDelete(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete purchase order?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will permanently delete{' '}
                            <span className="font-medium text-foreground">
                                {purchaseOrderToDelete?.order_number}
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
                            onClick={() => {
                                if (!purchaseOrderToDelete) {
                                    return;
                                }

                                destroy(
                                    `/purchase-orders/${purchaseOrderToDelete.id}`,
                                );

                                setPurchaseOrderToDelete(null);
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
