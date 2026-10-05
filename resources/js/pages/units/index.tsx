import { Head, Link, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { usePermissions } from '@/hooks/use-permissions';
import type { Unit } from '@/types/ingredients';

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

    const { can } = usePermissions();

    const canManageUnits =
        can('update', 'units') ||
        can('delete', 'units');

    return (
        <>
            <Head title="Units" />

            <div className="space-y-6">
                {/* Page Header */}
                <PageHeader
                    title="Units"
                    description="Manage the units used to measure ingredients."
                >
                    {can('create', 'units') && (
                        <Button asChild>
                            <Link href="/units/create">
                                <Plus />
                                Add Unit
                            </Link>
                        </Button>
                    )}
                </PageHeader>

                {/* Units Card */}
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

                        {can('create', 'units') && (
                            <Button asChild>
                                <Link href="/units/create">
                                    <Plus />
                                    Add Unit
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
                                        Unit
                                    </TableHead>

                                    <TableHead className="font-semibold text-foreground">
                                        Symbol
                                    </TableHead>

                                    {canManageUnits && (
                                        <TableHead className="text-right font-semibold text-foreground">
                                            Actions
                                        </TableHead>
                                    )}
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
                                            <Badge variant="secondary" >
                                                {unit.symbol}
                                            </Badge>
                                        </TableCell>

                                        {canManageUnits && (
                                            <TableCell>
                                                <div className="flex justify-end gap-2">
                                                    {can('update', 'units') && (
                                                        <Button
                                                            asChild
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <Link href={`/units/${unit.id}/edit`}>
                                                                <Pencil />
                                                                <span className="hidden sm:inline">
                                                                    Edit
                                                                </span>
                                                            </Link>
                                                        </Button>
                                                    )}

                                                    {can('delete', 'units') && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="text-destructive hover:text-destructive"
                                                            onClick={() => setUnitToDelete(unit)}
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
