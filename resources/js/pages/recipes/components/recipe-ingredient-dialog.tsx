import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Field,
    FieldError,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

type Ingredient = {
    id: number;
    name: string;
    unit: {
        symbol: string;
    };
};

type Props = {
    recipeId: number;
    ingredients: Ingredient[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function RecipeIngredientDialog({
    recipeId,
    ingredients,
    open,
    onOpenChange,
}: Props) {
    const { data, setData, post, processing, errors, reset } =
        useForm({
            ingredient_id: '',
            quantity: '',
        });

    const selectedIngredient = ingredients.find(
        (ingredient) =>
            String(ingredient.id) === data.ingredient_id,
    );

    const submit = (event: React.FormEvent) => {
        event.preventDefault();

        post(`/recipes/${recipeId}/ingredients`, {
            onSuccess: () => {
                reset();
                onOpenChange(false);
            },
        });
    };

    const handleOpenChange = (value: boolean) => {
        if (!value && !processing) {
            reset();
        }

        onOpenChange(value);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add Ingredient
                    </DialogTitle>

                    <DialogDescription>
                        Add an ingredient and specify the quantity
                        required for one serving.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={submit}
                    className="space-y-6"
                >
                    <Field
                        data-invalid={
                            !!errors.ingredient_id
                        }
                    >
                        <FieldLabel htmlFor="ingredient_id">
                            Ingredient
                        </FieldLabel>

                        <Select
                            value={data.ingredient_id}
                            onValueChange={(value) =>
                                setData(
                                    'ingredient_id',
                                    value,
                                )
                            }
                        >
                            <SelectTrigger
                                id="ingredient_id"
                                aria-invalid={
                                    !!errors.ingredient_id
                                }
                            >
                                <SelectValue placeholder="Select an ingredient" />
                            </SelectTrigger>

                            <SelectContent>
                                {ingredients.map(
                                    (ingredient) => (
                                        <SelectItem
                                            key={
                                                ingredient.id
                                            }
                                            value={String(
                                                ingredient.id,
                                            )}
                                        >
                                            {ingredient.name} (
                                            {
                                                ingredient
                                                    .unit
                                                    .symbol
                                            }
                                            )
                                        </SelectItem>
                                    ),
                                )}
                            </SelectContent>
                        </Select>

                        <FieldError>
                            {errors.ingredient_id}
                        </FieldError>
                    </Field>

                    <Field
                        data-invalid={!!errors.quantity}
                    >
                        <FieldLabel htmlFor="quantity">
                            Quantity
                        </FieldLabel>

                        <div className="relative">
                            <Input
                                id="quantity"
                                type="number"
                                min="0.001"
                                step="0.001"
                                value={data.quantity}
                                onChange={(event) =>
                                    setData(
                                        'quantity',
                                        event.target.value,
                                    )
                                }
                                placeholder="e.g. 0.200"
                                className={
                                    selectedIngredient
                                        ? 'pr-14'
                                        : undefined
                                }
                                aria-invalid={
                                    !!errors.quantity
                                }
                            />

                            {selectedIngredient && (
                                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground">
                                    {
                                        selectedIngredient
                                            .unit
                                            .symbol
                                    }
                                </span>
                            )}
                        </div>

                        <FieldError>
                            {errors.quantity}
                        </FieldError>
                    </Field>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                handleOpenChange(false)
                            }
                            disabled={processing}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                processing ||
                                ingredients.length === 0
                            }
                        >
                            {processing ? (
                                <Spinner />
                            ) : (
                                <Plus />
                            )}
                            Add Ingredient
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}