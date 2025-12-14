<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class CustomerApiController extends Controller
{
    /**
     * Get all customers
     */
    public function index(): JsonResponse
    {
        try {
            $customers = Customer::with(['contracts', 'payments', 'customerNotes'])->get();
            
            return response()->json([
                'success' => true,
                'data' => $customers,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'فشل في جلب العملاء',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create a new customer
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'customer_number' => 'required|string|unique:customers,customer_number',
                'name' => 'required|string|max:255',
                'email' => 'nullable|email|unique:customers,email',
                'phone' => 'nullable|string',
                'address' => 'nullable|string',
                'nationality' => 'nullable|string',
                'customer_type' => 'required|in:INDIVIDUAL,COMPANY',
                'id_number' => 'nullable|string',
                'commercial_record' => 'nullable|string',
                'status' => 'required|in:ACTIVE,INACTIVE',
                'registration_date' => 'required|date',
                'guarantor_name' => 'nullable|string',
                'guarantor_phone' => 'nullable|string',
                'guarantor_id' => 'nullable|string',
                'notes' => 'nullable|string',
                'warnings' => 'nullable|string',
                'rating' => 'nullable|integer|min:1|max:5',
            ]);

            // Handle file uploads
            if ($request->hasFile('idCardCopy')) {
                $validated['id_card_copy_path'] = $request->file('idCardCopy')->store('customers/id-cards', 'public');
            }

            if ($request->hasFile('guarantorIdCardCopy')) {
                $validated['guarantor_id_card_copy_path'] = $request->file('guarantorIdCardCopy')->store('customers/guarantor-id-cards', 'public');
            }

            if ($request->hasFile('commercialRecordCopy')) {
                $validated['commercial_record_copy_path'] = $request->file('commercialRecordCopy')->store('customers/commercial-records', 'public');
            }

            $customer = Customer::create($validated);

            return response()->json([
                'success' => true,
                'data' => $customer->load(['contracts', 'payments', 'customerNotes']),
                'message' => 'تم إنشاء العميل بنجاح',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'خطأ في التحقق من البيانات',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'فشل في إنشاء العميل',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a specific customer
     */
    public function show(string $id): JsonResponse
    {
        try {
            $customer = Customer::with(['contracts', 'payments', 'customerNotes'])->findOrFail($id);
            
            return response()->json([
                'success' => true,
                'data' => $customer,
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'العميل غير موجود',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'فشل في جلب العميل',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update a customer
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $customer = Customer::findOrFail($id);

            $validated = $request->validate([
                'customer_number' => 'required|string|unique:customers,customer_number,' . $id,
                'name' => 'required|string|max:255',
                'email' => 'nullable|email|unique:customers,email,' . $id,
                'phone' => 'nullable|string',
                'address' => 'nullable|string',
                'nationality' => 'nullable|string',
                'customer_type' => 'required|in:INDIVIDUAL,COMPANY',
                'id_number' => 'nullable|string',
                'commercial_record' => 'nullable|string',
                'status' => 'required|in:ACTIVE,INACTIVE',
                'registration_date' => 'required|date',
                'guarantor_name' => 'nullable|string',
                'guarantor_phone' => 'nullable|string',
                'guarantor_id' => 'nullable|string',
                'notes' => 'nullable|string',
                'warnings' => 'nullable|string',
                'rating' => 'nullable|integer|min:1|max:5',
            ]);

            // Handle file uploads
            if ($request->hasFile('idCardCopy')) {
                if ($customer->id_card_copy_path) {
                    Storage::disk('public')->delete($customer->id_card_copy_path);
                }
                $validated['id_card_copy_path'] = $request->file('idCardCopy')->store('customers/id-cards', 'public');
            }

            if ($request->hasFile('guarantorIdCardCopy')) {
                if ($customer->guarantor_id_card_copy_path) {
                    Storage::disk('public')->delete($customer->guarantor_id_card_copy_path);
                }
                $validated['guarantor_id_card_copy_path'] = $request->file('guarantorIdCardCopy')->store('customers/guarantor-id-cards', 'public');
            }

            if ($request->hasFile('commercialRecordCopy')) {
                if ($customer->commercial_record_copy_path) {
                    Storage::disk('public')->delete($customer->commercial_record_copy_path);
                }
                $validated['commercial_record_copy_path'] = $request->file('commercialRecordCopy')->store('customers/commercial-records', 'public');
            }

            $customer->update($validated);

            return response()->json([
                'success' => true,
                'data' => $customer->load(['contracts', 'payments', 'customerNotes']),
                'message' => 'تم تحديث العميل بنجاح',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => 'خطأ في التحقق من البيانات',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'العميل غير موجود',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'فشل في تحديث العميل',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a customer
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $customer = Customer::findOrFail($id);
            
            // Delete associated files
            if ($customer->id_card_copy_path) {
                Storage::disk('public')->delete($customer->id_card_copy_path);
            }
            if ($customer->guarantor_id_card_copy_path) {
                Storage::disk('public')->delete($customer->guarantor_id_card_copy_path);
            }
            if ($customer->commercial_record_copy_path) {
                Storage::disk('public')->delete($customer->commercial_record_copy_path);
            }
            
            $customer->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف العميل بنجاح',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => 'العميل غير موجود',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'فشل في حذف العميل',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
