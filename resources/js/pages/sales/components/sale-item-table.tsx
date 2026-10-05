import { router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import type { SaleItem } from '@/types/sales';

type Props = {
    saleId: number;
    items: SaleItem[];
    canEdit: boolean;
    canRemove: boolean;
    onEdit: (item: SaleItem) => void;
};

function formatCurrency(value: string | number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value));
}

export function SaleItemTable({
    saleId,
    items,
    canEdit,
    canRemove,
    onEdit,
}: Props) {
    const [deletingItem, setDeletingItem] =
        useState<SaleItem | null>(null);

    const [deleteDialogOpen, setDeleteDialogOpen] =
        useState(false);

    const hasActions = canEdit || canRemove;

    return (
        <>
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

                            {hasActions && (
                                <th className="px-2 py-3 text-right font-medium">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {items.map((item, index) => {
                            const subtotal =
                                Number(item.quantity) *
                                Number(item.unit_price);

                            return (
                                <tr
                                    key={item.id}
                                    className="border-b last:border-0"
                                >
                                    <td className="px-2 py-3">
                                        {index + 1}
                                    </td>

                                    <td className="px-2 py-3 font-medium">
                                        {item.recipe.name}
                                    </td>

                                    <td className="px-2 py-3 text-right">
                                        {Number(item.quantity)}
                                    </td>

                                    <td className="px-2 py-3 text-right">
                                        {formatCurrency(
                                            item.unit_price,
                                        )}
                                    </td>

                                    <td className="px-2 py-3 text-right font-medium">
                                        {formatCurrency(subtotal)}
                                    </td>

                                    {hasActions && (
                                        <td className="px-2 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                {canEdit && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            onEdit(item)
                                                        }
                                                    >
                                                        <Pencil />

                                                        <span className="hidden sm:inline">
                                                            Edit
                                                        </span>
                                                    </Button>
                                                )}

                                                {canRemove && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => {
                                                            setDeletingItem(
                                                                item,
                                                            );
                                                            setDeleteDialogOpen(
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
                        })}
                    </tbody>
                </table>
            </div>

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={(open) => {
                    setDeleteDialogOpen(open);

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
                                    `/sales/${saleId}/items/${deletingItem.id}`,
                                    {
                                        onSuccess: () => {
                                            setDeleteDialogOpen(
                                                false,
                                            );
                                            setDeletingItem(null);
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
        </>
    );
}
