<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWilayatRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $wilayat = $this->route('wilayat');
        $governorateId = $this->input('governorate_id') ?? $wilayat?->governorate_id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('wilayats', 'name')
                    ->where('governorate_id', $governorateId)
                    ->ignore($wilayat?->id),
            ],
            'governorate_id' => ['required', 'exists:governorates,id'],
        ];
    }
}
