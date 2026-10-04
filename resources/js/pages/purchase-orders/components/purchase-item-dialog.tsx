import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import PurchaseItemForm from './purchase-item-form';

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
    ingredient: Ingredient;
    quantity: string;
    unit_price: string;
};

type Props = {
    purchaseOrderId: number;
    ingredients: Ingredient[];
    item?: PurchaseItem | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function PurchaseItemDialog({
    purchaseOrderId,
    ingredients,
    item = null,
    open,
    onOpenChange,
}: Props) {
    const isEditing = item !== null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? 'Edit Purchase Item'
                            : 'Add Purchase Item'}
                    </DialogTitle>

                    <DialogDescription>
                        {isEditing
                            ? 'Update the ingredient, quantity, or unit price.'
                            : 'Add an ingredient to this purchase order.'}
                    </DialogDescription>
                </DialogHeader>

                <PurchaseItemForm
                    key={item?.id ?? 'new'}
                    purchaseOrderId={purchaseOrderId}
                    ingredients={ingredients}
                    item={item}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
