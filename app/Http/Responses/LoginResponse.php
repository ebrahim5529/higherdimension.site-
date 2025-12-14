<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginViewResponse;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginViewResponse
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  Request  $request
     * @return Response
     */
    public function toResponse($request): Response
    {
        return \Inertia\Inertia::render('Auth/Login');
    }
}

