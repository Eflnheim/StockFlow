<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Customer::class);

        $customers = Customer::query()
            ->latest()
            ->get();

        return Inertia::render('customers/index', [
            'customers' => $customers,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Customer::class);

        return Inertia::render('customers/create');
    }

    public function store(
        StoreCustomerRequest $request
    ): RedirectResponse {
        $this->authorize('create', Customer::class);

        $customer = Customer::create(
            $request->validated()
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Customer created successfully.',
        ]);

        return to_route('customers.index');
    }

    public function edit(
        Customer $customer
    ): Response {
        $this->authorize('update', $customer);

        return Inertia::render('customers/edit', [
            'customer' => $customer,
        ]);
    }

    public function update(
        UpdateCustomerRequest $request,
        Customer $customer
    ): RedirectResponse {
        $this->authorize('update', $customer);

        $customer->update(
            $request->validated()
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Customer updated successfully.',
        ]);

        return to_route('customers.index');
    }

    public function destroy(
        Customer $customer
    ): RedirectResponse {
        $this->authorize('delete', $customer);

        $customer->delete();

        return Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Customer deleted successfully.',
        ])->back();
    }
}