import { Link } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';

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

import type { Ingredient } from '@/types/ingredients';

interface IngredientsTableProps {
    ingredients: Ingredient[];
    canUpdate: boolean;
    canDelete: boolean;
    onDelete: (ingredient: Ingredient) => void;
}

export function IngredientsTable({
    ingredients,
    canUpdate,
    canDelete,
    onDelete,
}: IngredientsTableProps) {
    const canManage = canUpdate || canDelete;

    return (
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

                        <TableHead className="font-semibold text-foreground">
                            Minimum Stock
                        </TableHead>

                        <TableHead className="font-semibold text-foreground">
                            Status
                        </TableHead>

                        {canManage && (
                            <TableHead className="text-right font-semibold text-foreground">
                                Actions
                            </TableHead>
                        )}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {ingredients.map((ingredient, index) => (
                        <TableRow key={ingredient.id}>
                            <TableCell className="text-muted-foreground">
                                {index + 1}
                            </TableCell>

                            <TableCell>
                                <span className="font-medium">
                                    {ingredient.name}
                                </span>
                            </TableCell>

                            <TableCell>
                                <span className="text-sm">
                                    {ingredient.category.name}
                                </span>
                            </TableCell>

                            <TableCell>
                                <span className="text-sm">
                                    {ingredient.unit.name}
                                </span>
                            </TableCell>

                            <TableCell>
                                <span className="text-sm">
                                    {Number(ingredient.minimum_stock)}{' '}
                                    {ingredient.unit.symbol}
                                </span>
                            </TableCell>

                            <TableCell>
                                <Badge
                                className="w-15 justify-center"
                                    variant={
                                        ingredient.is_active
                                            ? 'default'
                                            : 'outline'
                                    }
                                >
                                    {ingredient.is_active
                                        ? 'Active'
                                        : 'Inactive'}
                                </Badge>
                            </TableCell>

                            {canManage && (
                                <TableCell>
                                    <div className="flex justify-end gap-2">
                                        {canUpdate && (
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Link
                                                    href={`/ingredients/${ingredient.id}/edit`}
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
                                                    onDelete(ingredient)
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
    );
}
