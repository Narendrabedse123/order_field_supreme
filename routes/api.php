<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['verify.shopify'])->group(function () {
 
});
Route::post('/getstoredetails', 'TodoController@getstoredetails');
Route::post('/getorders', 'TodoController@getorders');
Route::post('/getfields', 'TodoController@getfields');
Route::post('/getactivefields', 'TodoController@getactivefields');
Route::post('/enabledfield', 'TodoController@enabledfield');
Route::post('/deletefield', 'TodoController@deletefield');
Route::post('/savefield', 'TodoController@savefield');
Route::post('/updatecartlayout', 'TodoController@updatecartlayout');
Route::post('/getcartlayout', 'TodoController@getcartlayout');
Route::post('/setupdetails', 'TodoController@setupdetails');
Route::post('/getplandetails', 'TodoController@getplandetails');
Route::post('/getlangdetails', 'TodoController@getlangdetails');
Route::post('/updatefieldlabelurl', 'TodoController@updatefieldlabelurl');
Route::post('/getcartpage', 'TodoController@getcartpage');
Route::post('/setcartpage', 'TodoController@setcartpage');
Route::post('/getplan', 'TodoController@getplan');
Route::post('/getfieldsbystore', 'TodoController@getfieldsbystore');
Route::post('/editfieldorderurl', 'TodoController@editfieldorderurl');
Route::post('/exportorders', 'TodoController@exportorders');
Route::post('/savedsearch', 'TodoController@savedsearch');
Route::post('/getsavedsearch', 'TodoController@getsavedsearch');
Route::post('/editfieldrequrl', 'TodoController@editfieldrequrl');
Route::post('/addvisits', 'TodoController@addvisits');
Route::post('/getvisits', 'TodoController@getvisits');
Route::post('/addstorerecord', 'TodoController@addstorerecord');
Route::fallback(function(){
    return response()->json(['message' => 'Resource not found.'], 404);
});