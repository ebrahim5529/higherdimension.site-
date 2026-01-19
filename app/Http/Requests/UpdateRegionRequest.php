<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRegionRequest extends FormRequest
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
        $region = $this->route('region');
        $wilayatId = $this->input('wilayat_id') ?? $region?->wilayat_id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('regions', 'name')
                    ->where('wilayat_id', $wilayatId)
                    ->ignore($region?->id),
            ],
            'wilayat_id' => ['required', 'exists:wilayats,id'],
        ];
    }
}
