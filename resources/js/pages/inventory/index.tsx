import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, Package, SlidersHorizontal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

type Ingredient = {
    id: number;
    name: string;
    minimum_stock: string;
    stock_movements_sum_quantity: string | null;
    category: {
        id: number;
        name: string;
    };
    unit: {
        id: number;
        name: string;
        symbol: string;
    };
};

type Props = {
    ingredients: Ingredient[];
};

function formatNumber(value: number): string {
    return new Intl.NumberFormat('id-ID', {
        maximumFractionDigits: 3,
    }).format(value);
}

function getStockStatus(
    currentStock: number,
    minimumStock: number,
): 'Good' | 'Low' {
    return currentStock <= minimumStock ? 'Low' : 'Good';
}

export default function Index({ ingredients }: Props) {
    return (
        <>
            <Head title="Inventory" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Inventory
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Monitor current ingredient stock and low-stock
                            levels.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href="/inventory/adjustment">
                            <SlidersHorizontal />
                            Stock Adjustment
                        </Link>
                    </Button>
                </div>

                {ingredients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                        <div className="mb-4 rounded-full bg-muted p-3">
                            <Package className="size-5 text-muted-foreground" />
                        </div>

                        <h3 className="font-medium">
                            No ingredients yet
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            Add ingredients first to start monitoring
                            your inventory.
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
                                        Category
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Unit
                                    </TableHead>

                                    <TableHead className="text-right font-semibold text-foreground">
                                        Current Stock
                                    </TableHead>

                                    <TableHead className="text-right font-semibold text-foreground">
                                        Minimum Stock
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Status
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {ingredients.map((ingredient, index) => {
                                    const currentStock = Number(
                                        ingredient.stock_movements_sum_quantity ??
                                        0,
                                    );

                                    const minimumStock = Number(
                                        ingredient.minimum_stock,
                                    );

                                    const status = getStockStatus(
                                        currentStock,
                                        minimumStock,
                                    );

                                    return (
                                        <TableRow key={ingredient.id}>
                                            <TableCell className="text-muted-foreground">
                                                {index + 1}
                                            </TableCell>

                                            <TableCell className="font-medium">
                                                {ingredient.name}
                                            </TableCell>

                                            <TableCell>
                                                {ingredient.category.name}
                                            </TableCell>

                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span>
                                                        {ingredient.unit.name}
                                                    </span>

                                                    <Badge
                                                        variant="secondary"
                                                        className="font-mono"
                                                    >
                                                        {
                                                            ingredient
                                                                .unit
                                                                .symbol
                                                        }
                                                    </Badge>
                                                </div>
                                            </TableCell>

                                            <TableCell className="text-right font-medium">
                                                {formatNumber(currentStock)}{' '}
                                                <span className="text-muted-foreground">
                                                    {
                                                        ingredient.unit
                                                            .symbol
                                                    }
                                                </span>
                                            </TableCell>

                                            <TableCell className="text-right">
                                                {formatNumber(minimumStock)}{' '}
                                                <span className="text-muted-foreground">
                                                    {
                                                        ingredient.unit
                                                            .symbol
                                                    }
                                                </span>
                                            </TableCell>

                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        status === 'Low'
                                                            ? 'destructive'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {status === 'Low' && (
                                                        <AlertTriangle />
                                                    )}

                                                    {status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </>
    );
}
