import { Head, Link, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
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

interface Unit {
    id: number;
    name: string;
    symbol: string;
}

interface Props {
    units: Unit[];
}

export default function Index({ units }: Props) {
    const { delete: destroy, processing } = useForm();

    const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);

    const handleDelete = () => {
        if (!unitToDelete) {
            return;
        }

        destroy(`/units/${unitToDelete.id}`, {
            onSuccess: () => {
                setUnitToDelete(null);
            },
        });
    };

    return (
        <>
            <Head title="Units" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Units
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage the units used to measure ingredients.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href="/units/create">
                            <Plus />
                            Add Unit
                        </Link>
                    </Button>
                </div>

                {/* Units Card */}
                <Card className="py-2">
                    <CardContent>
                        {units.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                                <div className="mb-4 rounded-full bg-muted p-3">
                                    <Plus className="size-5 text-muted-foreground" />
                                </div>

                                <h3 className="font-medium">
                                    No units yet
                                </h3>

                                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                    Create your first unit to start measuring
                                    ingredients in your inventory.
                                </p>

                                <Button asChild className="mt-4">
                                    <Link href="/units/create">
                                        <Plus />
                                        Add Unit
                                    </Link>
                                </Button>
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
                                                Unit
                                            </TableHead>

                                            <TableHead className="font-semibold text-foreground">
                                                Symbol
                                            </TableHead>

                                            <TableHead className="text-right font-semibold text-foreground">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {units.map((unit, index) => (
                                            <TableRow key={unit.id}>
                                                <TableCell className="text-muted-foreground">
                                                    {index + 1}
                                                </TableCell>

                                                <TableCell>
                                                    <span className="font-medium">
                                                        {unit.name}
                                                    </span>
                                                </TableCell>

                                                <TableCell>
                                                    <Badge variant="secondary" className="font-mono">
                                                        {unit.symbol}
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
                                                                href={`/units/${unit.id}/edit`}
                                                            >
                                                                <Pencil />
                                                                <span className="hidden sm:inline">
                                                                    Edit
                                                                </span>
                                                            </Link>
                                                        </Button>

                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() =>
                                                                setUnitToDelete(
                                                                    unit,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 />
                                                            <span className="hidden sm:inline">
                                                                Delete
                                                            </span>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Delete Confirmation */}
                <AlertDialog
                    open={unitToDelete !== null}
                    onOpenChange={(open) => {
                        if (!open && !processing) {
                            setUnitToDelete(null);
                        }
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Delete unit?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                                Are you sure you want to delete{' '}
                                <strong>{unitToDelete?.name}</strong> (
                                {unitToDelete?.symbol})? This action cannot be
                                undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={processing}>
                                Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                                disabled={processing}
                                onClick={handleDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {processing ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );
}
