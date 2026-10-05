import { useForm } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { PurchaseItem } from '@/types/purchase-orders';

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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Props = {
    purchaseOrderId: number;
    items: PurchaseItem[];
    canDelete: boolean;
    canEdit: boolean;
    onEdit: (item: PurchaseItem) => void;
};

function formatNumber(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        maximumFractionDigits: 3,
    }).format(value);
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(value);
}

export default function PurchaseItemTable({
    purchaseOrderId,
    items,
    canDelete,
    canEdit,
    onEdit,
}: Props) {
    const { delete: destroy, processing } = useForm();

    const [itemToDelete, setItemToDelete] =
        useState<PurchaseItem | null>(null);

    const totalAmount = items.reduce(
        (total, item) =>
            total +
            Number(item.quantity) * Number(item.unit_price),
        0,
    );

    return (
        <>
            <div>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-semibold text-foreground">
                                    Ingredient
                                </TableHead>

                                <TableHead className="font-semibold text-foreground">
                                    Quantity
                                </TableHead>

                                <TableHead className="font-semibold text-foreground">
                                    Unit Price
                                </TableHead>

                                <TableHead className="text-right font-semibold text-foreground">
                                    Subtotal
                                </TableHead>

                                {(canEdit || canDelete) && (
                                    <TableHead className="text-right font-semibold text-foreground">
                                        Actions
                                    </TableHead>
                                )}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {items.map((item) => {
                                const quantity = Number(item.quantity);
                                const unitPrice = Number(item.unit_price);
                                const subtotal =
                                    quantity * unitPrice;

                                return (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {item.ingredient.name}
                                        </TableCell>

                                        <TableCell>
                                            {formatNumber(quantity)}{' '}
                                            <span>
                                                {item.ingredient.unit.symbol}
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                            {formatCurrency(unitPrice)}
                                        </TableCell>

                                        <TableCell className="text-right font-medium">
                                            {formatCurrency(subtotal)}
                                        </TableCell>

                                        {(canEdit || canDelete) && (
                                            <TableCell>
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

                                                    {canDelete && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() =>
                                                                setItemToDelete(
                                                                    item,
                                                                )
                                                            }
                                                            disabled={
                                                                processing
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
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex justify-end border-t pt-3 pr-1">
                    <div className="flex items-center gap-2 text-base font-semibold">
                        <span>Total</span>
                        <span>=</span>
                        <span>
                            {formatCurrency(totalAmount)}
                        </span>
                    </div>
                </div>
            </div>

            <AlertDialog
                open={itemToDelete !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setItemToDelete(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Remove purchase item?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            This will remove{' '}
                            <span className="font-medium text-foreground">
                                {itemToDelete?.ingredient.name}
                            </span>{' '}
                            from this purchase order. This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            variant="destructive"
                            onClick={() => {
                                if (!itemToDelete) {
                                    return;
                                }

                                destroy(
                                    `/purchase-orders/${purchaseOrderId}/items/${itemToDelete.id}`,
                                );

                                setItemToDelete(null);
                            }}
                        >
                            Remove
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
