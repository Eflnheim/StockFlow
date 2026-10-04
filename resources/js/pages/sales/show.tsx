import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Ban,
    Check,
    Pencil,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

import { SaleItemDialog } from '@/pages/sales/components/sale-item-dialog';
import { SaleItemEditDialog } from '@/pages/sales/components/sale-item-edit-dialog';
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
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { usePermissions } from '@/hooks/use-permissions';

type Customer = {
    id: number;
    name: string;
};

type User = {
    id: number;
    name: string;
};

type Recipe = {
    id: number;
    name: string;
    selling_price: string;
};

type SaleItem = {
    id: number;
    quantity: string;
    unit_price: string;
    recipe: Recipe;
};

type Sale = {
    id: number;
    invoice_number: string;
    sale_date: string;
    total_amount: string;
    status: string;
    notes: string | null;
    customer: Customer | null;
    user: User;
    items: SaleItem[];
};

type Props = {
    sale: Sale;
    recipes: Recipe[];
};

function formatCurrency(value: string | number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value));
}

function formatDate(value: string): string {
    return new Date(value).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

function formatStatus(value: string): string {
    return value
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function Show({ sale, recipes }: Props) {
    const { can } = usePermissions();

    const [itemDialogOpen, setItemDialogOpen] =
        useState(false);

    const [editingItem, setEditingItem] =
        useState<SaleItem | null>(null);

    const [editDialogOpen, setEditDialogOpen] =
        useState(false);

    const [deletingItem, setDeletingItem] =
        useState<SaleItem | null>(null);

    const [deleteItemDialogOpen, setDeleteItemDialogOpen] =
        useState(false);

    const [deleteSaleDialogOpen, setDeleteSaleDialogOpen] =
        useState(false);

    const [cancelDialogOpen, setCancelDialogOpen] =
        useState(false);

    const isPending = sale.status === 'pending';
    const isCompleted = sale.status === 'completed';

    const canEdit =
        can('update', 'sales') && isPending;

    const canRemove =
        can('delete', 'sales') && isPending;

    const canAddItem =
        can('create', 'sales') && isPending;

    const canComplete =
        can('update', 'sales') && isPending;

    const canCancel =
        can('update', 'sales') && isCompleted;

    return (
        <>
            <Head title={sale.invoice_number} />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-3">
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
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    {sale.invoice_number}
                                </h1>

                                <Badge
                                    variant={
                                        sale.status ===
                                        'cancelled'
                                            ? 'destructive'
                                            : 'secondary'
                                    }
                                >
                                    {formatStatus(
                                        sale.status,
                                    )}
                                </Badge>
                            </div>

                            <p className="mt-1 text-sm text-muted-foreground">
                                View sale details and purchased
                                items.
                            </p>
                        </div>
                    </div>

                    {(canComplete ||
                        canEdit ||
                        canRemove ||
                        canCancel) && (
                        <div className="flex flex-wrap gap-2">
                            {canComplete && (
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        router.post(
                                            `/sales/${sale.id}/complete`,
                                        )
                                    }
                                >
                                    <Check />
                                    <span className="hidden sm:inline">
                                        Complete Sale
                                    </span>
                                </Button>
                            )}

                            {canCancel && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() =>
                                        setCancelDialogOpen(
                                            true,
                                        )
                                    }
                                >
                                    <Ban />
                                    <span className="hidden sm:inline">
                                        Cancel Sale
                                    </span>
                                </Button>
                            )}

                            {canEdit && (
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                >
                                    <Link
                                        href={`/sales/${sale.id}/edit`}
                                    >
                                        <Pencil />
                                        <span className="hidden sm:inline">
                                            Edit
                                        </span>
                                    </Link>
                                </Button>
                            )}

                            {canRemove && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() =>
                                        setDeleteSaleDialogOpen(
                                            true,
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
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Sale Details</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Customer
                                </p>

                                <p className="mt-1 font-medium">
                                    {sale.customer?.name ??
                                        'Walk-in Customer'}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Sale Date
                                </p>

                                <p className="mt-1 font-medium">
                                    {formatDate(
                                        sale.sale_date,
                                    )}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Cashier
                                </p>

                                <p className="mt-1 font-medium">
                                    {sale.user.name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total
                                </p>

                                <p className="mt-1 text-lg font-semibold">
                                    {formatCurrency(
                                        sale.total_amount,
                                    )}
                                </p>
                            </div>
                        </div>

                        {sale.notes && (
                            <div className="mt-6 border-t pt-6">
                                <p className="text-sm text-muted-foreground">
                                    Notes
                                </p>

                                <p className="mt-1 whitespace-pre-wrap text-sm">
                                    {sale.notes}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <CardTitle>
                                    Sale Items
                                </CardTitle>

                                <p className="mt-1 text-sm text-muted-foreground">
                                    Recipes included in this
                                    sale.
                                </p>
                            </div>

                            {canAddItem && (
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        setItemDialogOpen(
                                            true,
                                        )
                                    }
                                >
                                    Add Item
                                </Button>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent>
                        {sale.items.length === 0 ? (
                            <div className="rounded-lg border border-dashed py-10 text-center">
                                <p className="text-sm text-muted-foreground">
                                    No items have been added to
                                    this sale yet.
                                </p>

                                {canAddItem && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-4"
                                        onClick={() =>
                                            setItemDialogOpen(
                                                true,
                                            )
                                        }
                                    >
                                        Add First Item
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left">
                                            <th className="px-2 py-3 font-medium">
                                                #
                                            </th>

                                            <th className="px-2 py-3 font-medium">
                                                Recipe
                                            </th>

                                            <th className="px-2 py-3 text-right font-medium">
                                                Quantity
                                            </th>

                                            <th className="px-2 py-3 text-right font-medium">
                                                Unit Price
                                            </th>

                                            <th className="px-2 py-3 text-right font-medium">
                                                Subtotal
                                            </th>

                                            {(canEdit ||
                                                canRemove) && (
                                                <th className="px-2 py-3 text-right font-medium">
                                                    Actions
                                                </th>
                                            )}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {sale.items.map(
                                            (item, index) => {
                                                const subtotal =
                                                    Number(
                                                        item.quantity,
                                                    ) *
                                                    Number(
                                                        item.unit_price,
                                                    );

                                                return (
                                                    <tr
                                                        key={
                                                            item.id
                                                        }
                                                        className="border-b last:border-0"
                                                    >
                                                        <td className="px-2 py-3">
                                                            {index +
                                                                1}
                                                        </td>

                                                        <td className="px-2 py-3 font-medium">
                                                            {
                                                                item
                                                                    .recipe
                                                                    .name
                                                            }
                                                        </td>

                                                        <td className="px-2 py-3 text-right">
                                                            {Number(
                                                                item.quantity,
                                                            )}
                                                        </td>

                                                        <td className="px-2 py-3 text-right">
                                                            {formatCurrency(
                                                                item.unit_price,
                                                            )}
                                                        </td>

                                                        <td className="px-2 py-3 text-right font-medium">
                                                            {formatCurrency(
                                                                subtotal,
                                                            )}
                                                        </td>

                                                        {(canEdit ||
                                                            canRemove) && (
                                                            <td className="px-2 py-3 text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    {canEdit && (
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                setEditingItem(
                                                                                    item,
                                                                                );
                                                                                setEditDialogOpen(
                                                                                    true,
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Pencil />

                                                                            <span className="hidden sm:inline">
                                                                                Edit
                                                                            </span>
                                                                        </Button>
                                                                    )}

                                                                    {canRemove && (
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="text-destructive hover:text-destructive"
                                                                            onClick={() => {
                                                                                setDeletingItem(
                                                                                    item,
                                                                                );
                                                                                setDeleteItemDialogOpen(
                                                                                    true,
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Trash2 />

                                                                            <span className="hidden sm:inline">
                                                                                Delete
                                                                            </span>
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        )}
                                                    </tr>
                                                );
                                            },
                                        )}
                                    </tbody>

                                    <tfoot>
                                        <tr>
                                            <td
                                                colSpan={
                                                    canEdit ||
                                                    canRemove
                                                        ? 4
                                                        : 3
                                                }
                                                className="px-2 py-4 text-right font-medium"
                                            >
                                                Total
                                            </td>

                                            <td className="px-2 py-4 text-right text-base font-semibold">
                                                {formatCurrency(
                                                    sale.total_amount,
                                                )}
                                            </td>

                                            {(canEdit ||
                                                canRemove) && (
                                                <td />
                                            )}
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <SaleItemDialog
                saleId={sale.id}
                recipes={recipes}
                open={itemDialogOpen}
                onOpenChange={setItemDialogOpen}
            />

            <SaleItemEditDialog
                saleId={sale.id}
                item={editingItem}
                open={editDialogOpen}
                onOpenChange={(open) => {
                    setEditDialogOpen(open);

                    if (!open) {
                        setEditingItem(null);
                    }
                }}
            />

            {/* Delete Sale Item */}
            <AlertDialog
                open={deleteItemDialogOpen}
                onOpenChange={(open) => {
                    setDeleteItemDialogOpen(open);

                    if (!open) {
                        setDeletingItem(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete Sale Item?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            {deletingItem
                                ? `This will remove "${deletingItem.recipe.name}" from this sale. The sale total will be recalculated.`
                                : 'This will remove the selected item from this sale.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => {
                                if (!deletingItem) {
                                    return;
                                }

                                router.delete(
                                    `/sales/${sale.id}/items/${deletingItem.id}`,
                                    {
                                        onSuccess: () => {
                                            setDeleteItemDialogOpen(
                                                false,
                                            );
                                            setDeletingItem(
                                                null,
                                            );
                                        },
                                    },
                                );
                            }}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Pending Sale */}
            <AlertDialog
                open={deleteSaleDialogOpen}
                onOpenChange={setDeleteSaleDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete Sale?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will permanently delete this
                            pending sale and all of its items.
                            No stock has been deducted yet.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => {
                                router.delete(
                                    `/sales/${sale.id}`,
                                    {
                                        onSuccess: () => {
                                            setDeleteSaleDialogOpen(
                                                false,
                                            );
                                        },
                                    },
                                );
                            }}
                        >
                            Delete Sale
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Cancel Completed Sale */}
            <AlertDialog
                open={cancelDialogOpen}
                onOpenChange={setCancelDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Cancel Sale?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will cancel the completed sale
                            and restore all ingredient stock
                            used by this sale. The sale will
                            remain in the system for history
                            and auditing.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Keep Sale
                        </AlertDialogCancel>

                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => {
                                router.post(
                                    `/sales/${sale.id}/cancel`,
                                    {},
                                    {
                                        onSuccess: () => {
                                            setCancelDialogOpen(
                                                false,
                                            );
                                        },
                                    },
                                );
                            }}
                        >
                            Cancel Sale
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
