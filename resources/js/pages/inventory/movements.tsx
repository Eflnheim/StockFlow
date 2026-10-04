import { Head } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Package } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type StockMovement = {
    id: number;
    type: string;
    quantity: string;
    reference_type: string | null;
    reference_id: number | null;
    notes: string | null;
    created_at: string;
    ingredient: {
        id: number;
        name: string;
        unit: {
            id: number;
            name: string;
            symbol: string;
        };
    };
    user: {
        id: number;
        name: string;
    };
};

type Props = {
    stockMovements: StockMovement[];
};

function formatNumber(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        maximumFractionDigits: 3,
    }).format(value);
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

function getTypeLabel(type: string): string {
    return type
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getTypeVariant(
    type: string,
): 'default' | 'secondary' | 'destructive' {
    if (type === 'purchase' || type === 'stock_in') {
        return 'default';
    }

    if (type === 'sale' || type === 'stock_out') {
        return 'destructive';
    }

    return 'secondary';
}

export default function Movements({
    stockMovements,
}: Props) {
    return (
        <>
            <Head title="Stock Movements" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Stock Movements
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        View the history of inventory stock changes.
                    </p>
                </div>

                {stockMovements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                        <div className="mb-4 rounded-full bg-muted p-3">
                            <Package className="size-5 text-muted-foreground" />
                        </div>

                        <h3 className="font-medium">
                            No stock movements yet
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            Stock movements will appear here when inventory
                            changes.
                        </p>
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
                                        Ingredient
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Type
                                    </TableHead>

                                    <TableHead className="text-right font-semibold text-foreground">
                                        Quantity
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        User
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Reference
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Date
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Notes
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {stockMovements.map(
                                    (movement, index) => {
                                        const quantity = Number(
                                            movement.quantity,
                                        );

                                        const isIncoming =
                                            quantity > 0;

                                        return (
                                            <TableRow
                                                key={movement.id}
                                            >
                                                <TableCell className="text-muted-foreground">
                                                    {index + 1}
                                                </TableCell>

                                                <TableCell className="font-medium">
                                                    <div>
                                                        <div>
                                                            {
                                                                movement
                                                                    .ingredient
                                                                    .name
                                                            }
                                                        </div>

                                                        <div className="text-xs text-muted-foreground">
                                                            {
                                                                movement
                                                                    .ingredient
                                                                    .unit
                                                                    .name
                                                            }{' '}
                                                            (
                                                            {
                                                                movement
                                                                    .ingredient
                                                                    .unit
                                                                    .symbol
                                                            }
                                                            )
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <Badge
                                                        variant={getTypeVariant(
                                                            movement.type,
                                                        )}
                                                    >
                                                        {movement.type ===
                                                            'purchase' && (
                                                            <ArrowDown />
                                                        )}

                                                        {(movement.type ===
                                                            'sale' ||
                                                            movement.type ===
                                                                'stock_out') && (
                                                            <ArrowUp />
                                                        )}

                                                        {getTypeLabel(
                                                            movement.type,
                                                        )}
                                                    </Badge>
                                                </TableCell>

                                                <TableCell className="text-right font-medium">
                                                    <span
                                                        className={
                                                            isIncoming
                                                                ? 'text-foreground'
                                                                : 'text-destructive'
                                                        }
                                                    >
                                                        {isIncoming
                                                            ? '+'
                                                            : ''}
                                                        {formatNumber(
                                                            quantity,
                                                        )}
                                                    </span>{' '}
                                                    <span className="text-muted-foreground">
                                                        {
                                                            movement
                                                                .ingredient
                                                                .unit
                                                                .symbol
                                                        }
                                                    </span>
                                                </TableCell>

                                                <TableCell>
                                                    {movement.user.name}
                                                </TableCell>

                                                <TableCell>
                                                    {movement.reference_type ? (
                                                        <span className="text-sm">
                                                            {movement.reference_type
                                                                .split('\\')
                                                                .pop()}{' '}
                                                            #
                                                            {
                                                                movement.reference_id
                                                            }
                                                        </span>
                                                    ) : (
                                                        <span className="text-muted-foreground">
                                                            —
                                                        </span>
                                                    )}
                                                </TableCell>

                                                <TableCell className="whitespace-nowrap">
                                                    {formatDateTime(
                                                        movement.created_at,
                                                    )}
                                                </TableCell>

                                                <TableCell className="max-w-xs">
                                                    <span className="line-clamp-2 text-sm text-muted-foreground">
                                                        {movement.notes ??
                                                            '—'}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    },
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </>
    );
}
