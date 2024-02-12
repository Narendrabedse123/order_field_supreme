<?php

use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/login', function () {
    if (Auth::user()) {
        return redirect()->route('home');
    }
    return view('login');
})->name('login');

Route::middleware(['verify.shopify','billable'])->group(function () {
    Route::get('/', function () {
        return view('welcome');
    })->name('home');

    // Other routes that need the shop user
});

Route::get('/login', function () {
    if (Auth::user()) {
        return redirect()->route('home');
    }
    return view('login');
})->name('login');


// Catches all other web routes.
Route::get('{slug}', function () {
    return view('index');
})->where('slug', '^(?!api).*$');