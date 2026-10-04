import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

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
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { usePermissions } from '@/hooks/use-permissions';

import PurchaseItemDialog from './components/purchase-item-dialog';
import PurchaseItemTable from './components/purchase-item-table';

type Supplier = {
    id: number;
    name: string;
};

type User = {
    id: number;
    name: string;
};

type Ingredient = {
    id: number;
    name: string;
    unit: {
        id: number;
        name: string;
        symbol: string;
    };
};

type PurchaseItem = {
    id: number;
    quantity: string;
    unit_price: string;
    ingredient: Ingredient;
};

type PurchaseOrder = {
    id: number;
    supplier: Supplier;
    user: User;
    order_number: string;
    order_date: string;
    status: 'pending' | 'received' | 'cancelled';
    notes: string | null;
    created_at: string;
    items: PurchaseItem[];
};

type Props = {
    purchaseOrder: PurchaseOrder;
    ingredients: Ingredient[];
};

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function formatDateTime(date: string): string {
    return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

function getStatusVariant(
    status: PurchaseOrder['status'],
): 'default' | 'secondary' | 'outline' {
    if (status === 'pending') {
        return 'secondary';
    }

    if (status === 'received') {
        return 'default';
    }

    return 'outline';
}

export default function Show({
    purchaseOrder,
    ingredients,
}: Props) {
    const { can } = usePermissions();

    const { delete: destroy, post } = useForm();

    const [deleteDialogOpen, setDeleteDialogOpen] =
        useState(false);

    const [receiveDialogOpen, setReceiveDialogOpen] =
        useState(false);

    const [itemDialogOpen, setItemDialogOpen] =
        useState(false);

    const [itemToEdit, setItemToEdit] =
        useState<PurchaseItem | null>(null);

    const canUpdate =
        can('update', 'purchase-orders') &&
        purchaseOrder.status === 'pending';

    const canDelete =
        can('delete', 'purchase-orders') &&
        purchaseOrder.status === 'pending';

    const openAddItemDialog = () => {
        setItemToEdit(null);
        setItemDialogOpen(true);
    };

    const openEditItemDialog = (item: PurchaseItem) => {
        setItemToEdit(item);
        setItemDialogOpen(true);
    };

    const closeItemDialog = (open: boolean) => {
        setItemDialogOpen(open);

        if (!open) {
            setItemToEdit(null);
        }
    };

    const receivePurchaseOrder = () => {
        post(`/purchase-orders/${purchaseOrder.id}/receive`, {
            onSuccess: () => {
                setReceiveDialogOpen(false);
            },
        });
    };

    return (
        <>
            <Head title={purchaseOrder.order_number} />

            <div className="space-y-6">
                {/* Back */}
                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="-ml-2"
                >
                    <Link href="/purchase-orders">
                        <ArrowLeft />
                        Back to Purchase Orders
                    </Link>
                </Button>

                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {purchaseOrder.order_number}
                            </h1>

                            <Badge
                                variant={getStatusVariant(
                                    purchaseOrder.status,
                                )}
                            >
                                {purchaseOrder.status
                                    .charAt(0)
                                    .toUpperCase() +
                                    purchaseOrder.status.slice(1)}
                            </Badge>
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Purchase order details and items.
                        </p>
                    </div>

                    {(canUpdate || canDelete) && (
                        <div className="flex gap-2">
                            {canUpdate && (
                                <Button
                                    asChild
                                    variant="outline"
                                >
                                    <Link
                                        href={`/purchase-orders/${purchaseOrder.id}/edit`}
                                    >
                                        <Pencil />
                                        Edit
                                    </Link>
                                </Button>
                            )}

                            {canDelete && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() =>
                                        setDeleteDialogOpen(true)
                                    }
                                >
                                    <Trash2 />
                                    Delete
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                {/* Purchase Order Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Purchase Order Details
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Supplier
                                </p>

                                <p className="mt-1 font-medium">
                                    {purchaseOrder.supplier.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Order Date
                                </p>

                                <p className="mt-1 font-medium">
                                    {formatDate(
                                        purchaseOrder.order_date,
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Created By
                                </p>

                                <p className="mt-1 font-medium">
                                    {purchaseOrder.user.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Created At
                                </p>

                                <p className="mt-1 font-medium">
                                    {formatDateTime(
                                        purchaseOrder.created_at,
                                    )}
                                </p>
                            </div>

                            {purchaseOrder.notes && (
                                <div className="sm:col-span-2">
                                    <p className="text-sm text-muted-foreground">
                                        Notes
                                    </p>

                                    <p className="mt-1 whitespace-pre-wrap font-medium">
                                        {purchaseOrder.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Purchase Items */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle>
                                    Purchase Items
                                </CardTitle>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Ingredients included in this purchase
                                    order.
                                </p>
                            </div>

                            {canUpdate && (
                                <Button
                                    type="button"
                                    onClick={openAddItemDialog}
                                >
                                    <Plus />
                                    Add Item
                                </Button>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent>
                        {purchaseOrder.items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center">
                                <div className="mb-4 rounded-full bg-muted p-3">
                                    <Plus className="size-5 text-muted-foreground" />
                                </div>

                                <h3 className="font-medium">
                                    No purchase items yet
                                </h3>

                                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                    Add ingredients to this purchase order
                                    before receiving it.
                                </p>
                            </div>
                        ) : (
                            <PurchaseItemTable
                                purchaseOrderId={purchaseOrder.id}
                                items={purchaseOrder.items}
                                canDelete={canUpdate}
                                canEdit={canUpdate}
                                onEdit={openEditItemDialog}
                            />
                        )}

                        {purchaseOrder.status === 'pending' &&
                            purchaseOrder.items.length > 0 &&
                            canUpdate && (
                                <div className="mt-6 flex justify-end border-t pt-6">
                                    <Button
                                        type="button"
                                        onClick={() => setReceiveDialogOpen(true)}
                                    >
                                        Receive Purchase Order
                                    </Button>
                                </div>
                            )}
                    </CardContent>
                </Card>
            </div>

            {/* Add / Edit Purchase Item Dialog */}
            <PurchaseItemDialog
                purchaseOrderId={purchaseOrder.id}
                ingredients={ingredients}
                item={itemToEdit}
                open={itemDialogOpen}
                onOpenChange={closeItemDialog}
            />

            {/* Delete Purchase Order Dialog */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete purchase order?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will permanently delete{' '}
                            <span className="font-medium text-foreground">
                                {purchaseOrder.order_number}
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
                                destroy(
                                    `/purchase-orders/${purchaseOrder.id}`,
                                );

                                setDeleteDialogOpen(false);
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={receiveDialogOpen}
                onOpenChange={setReceiveDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Receive purchase order?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will add all purchase item quantities to inventory
                            and mark{' '}
                            <span className="font-medium text-foreground">
                                {purchaseOrder.order_number}
                            </span>{' '}
                            as received. Once received, this purchase order can no
                            longer be edited.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={receivePurchaseOrder}
                        >
                            Receive Purchase Order
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
