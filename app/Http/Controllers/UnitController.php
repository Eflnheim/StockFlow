<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUnitRequest;
use App\Http\Requests\UpdateUnitRequest;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $this->authorize('viewAny', Unit::class);

        $units = Unit::query()
            ->latest()
            ->get();

        return Inertia::render('units/index', [
            'units' => $units,
        ]);   
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('create', Unit::class);

        return Inertia::render('units/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(
        StoreUnitRequest $request
    ): RedirectResponse {
        $this->authorize('create', Unit::class);

        Unit::create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Unit created successfully.',
        ]);

        return to_route('units.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Unit $unit): Response
    {
        $this->authorize('view', $unit);

        return Inertia::render('units/show', [
            'unit' => $unit,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Unit $unit): Response
    {
        $this->authorize('update', $unit);

        return Inertia::render('units/edit', [
            'unit' => $unit,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        UpdateUnitRequest $request,
        Unit $unit
    ): RedirectResponse {
        $this->authorize('update', $unit);

        $unit->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Unit updated successfully.',
        ]);

        return to_route('units.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Unit $unit): RedirectResponse
    {
        $this->authorize('delete', $unit);

        if ($unit->ingredients()->exists()) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Cannot delete a unit that is still being used by ingredients.',
            ]);

            return to_route('units.index');
        }

        $unit->delete();

        return Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Unit deleted successfully.',
        ])->back();
    }
}
