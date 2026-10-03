<?php

namespace App\Policies;

use App\Models\IngredientCategory;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class IngredientCategoryPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, IngredientCategory $ingredientCategory): bool
    {
        return true;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return in_array($user->role?->name, ['Admin', 'Purchasing'], true);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, IngredientCategory $ingredientCategory): bool
    {
        return in_array($user->role?->name, ['Admin', 'Purchasing'], true);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, IngredientCategory $ingredientCategory): bool
    {
        return in_array($user->role?->name, ['Admin', 'Purchasing'], true);
    }
}
