<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGovernorateRequest;
use App\Http\Requests\StoreRegionRequest;
use App\Http\Requests\StoreWilayatRequest;
use App\Http\Requests\UpdateGovernorateRequest;
use App\Http\Requests\UpdateRegionRequest;
use App\Http\Requests\UpdateWilayatRequest;
use App\Models\Governorate;
use App\Models\Region;
use App\Models\Wilayat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    public function index(): Response
    {
        $governorates = Governorate::query()
            ->orderBy('name')
            ->get();

        return Inertia::render('Settings/Governorates/Index', [
            'governorates' => $governorates,
        ]);
    }

    public function wilayatsIndex(): Response
    {
        $governorates = Governorate::query()
            ->orderBy('name')
            ->get();

        $wilayats = Wilayat::query()
            ->with('governorate')
            ->orderBy('name')
            ->get();

        return Inertia::render('Settings/Wilayats/Index', [
            'governorates' => $governorates,
            'wilayats' => $wilayats,
        ]);
    }

    public function regionsIndex(): Response
    {
        $governorates = Governorate::query()
            ->orderBy('name')
            ->get();

        $wilayats = Wilayat::query()
            ->with('governorate')
            ->orderBy('name')
            ->get();

        $regions = Region::query()
            ->with('wilayat.governorate')
            ->orderBy('name')
            ->get();

        return Inertia::render('Settings/Regions/Index', [
            'governorates' => $governorates,
            'wilayats' => $wilayats,
            'regions' => $regions,
        ]);
    }

    public function storeGovernorate(StoreGovernorateRequest $request): RedirectResponse
    {
        Governorate::create($request->validated());

        return redirect()->back()->with('success', 'تم إضافة المحافظة بنجاح');
    }

    public function updateGovernorate(UpdateGovernorateRequest $request, Governorate $governorate): RedirectResponse
    {
        $governorate->update($request->validated());

        return redirect()->back()->with('success', 'تم تحديث المحافظة بنجاح');
    }

    public function destroyGovernorate(Governorate $governorate): RedirectResponse
    {
        $governorate->delete();

        return redirect()->back()->with('success', 'تم حذف المحافظة بنجاح');
    }

    public function storeWilayat(StoreWilayatRequest $request): RedirectResponse
    {
        Wilayat::create($request->validated());

        return redirect()->back()->with('success', 'تم إضافة الولاية بنجاح');
    }

    public function updateWilayat(UpdateWilayatRequest $request, Wilayat $wilayat): RedirectResponse
    {
        $wilayat->update($request->validated());

        return redirect()->back()->with('success', 'تم تحديث الولاية بنجاح');
    }

    public function destroyWilayat(Wilayat $wilayat): RedirectResponse
    {
        $wilayat->delete();

        return redirect()->back()->with('success', 'تم حذف الولاية بنجاح');
    }

    public function storeRegion(StoreRegionRequest $request): RedirectResponse
    {
        Region::create($request->validated());

        return redirect()->back()->with('success', 'تم إضافة المنطقة بنجاح');
    }

    // API methods for selectors
    public function updateRegion(UpdateRegionRequest $request, Region $region): RedirectResponse
    {
        $region->update($request->validated());

        return redirect()->back()->with('success', 'تم تحديث المنطقة بنجاح');
    }

    public function destroyRegion(Region $region): RedirectResponse
    {
        $region->delete();

        return redirect()->back()->with('success', 'تم حذف المنطقة بنجاح');
    }

    public function getGovernorates(): JsonResponse
    {
        return response()->json(
            Governorate::query()->orderBy('name')->get()
        );
    }

    public function getWilayats(Governorate $governorate): JsonResponse
    {
        return response()->json(
            $governorate->wilayats()->orderBy('name')->get()
        );
    }

    public function getRegions(Wilayat $wilayat): JsonResponse
    {
        return response()->json(
            $wilayat->regions()->orderBy('name')->get()
        );
    }
}
