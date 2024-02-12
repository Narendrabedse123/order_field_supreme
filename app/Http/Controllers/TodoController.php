<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\APIController;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\TodoCollection;
use App\Http\Resources\TodoResource;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Osiset\BasicShopifyAPI\BasicShopifyAPI;
use Osiset\BasicShopifyAPI\Options;
use Osiset\BasicShopifyAPI\Session;
use File;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class TodoController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public $successStatus = 200;
    public function getstoredetails(Request $request)
    {

        $arcafy = env('ARCAFY', null);
        $store = request('store');
      
     
        $stores = DB::table('users')
            ->select('*')
            ->where('store', $store)
            ->first();

        return response()->json([
            'status' => 200,
            'data' => $stores,
            'arcafy' => $arcafy,
        ], 200);

    }
   

    public function getorders(Request $request)
    {
        $api_key = env('SHOPIFY_API_KEY', null);
        $checkrecord = DB::table('users')->where('name', request('shop'))->first();
    
        $shop = $checkrecord->name;
        $shop_id = $checkrecord->id;
        $api_secret = $checkrecord->password;
        $api_key = env('SHOPIFY_API_KEY', null);
        $since_id = request('since_id');
        $ids = request('search');
        $limit = request('limit');
        $SHOPIFY_API_VERSION = env('SHOPIFY_API_VERSION', 2023-04);
           // $created_at_max = date("yyyy-MM-dd'T'HH:mm:ss'Z'");
           $created_at_max = date('Y-m-d\TH:i:s'.substr((string)microtime(), 1, 4).'\Z');
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://".$api_key.":".$api_secret."@".$shop."/admin/api/2023-07/orders.json?status=any&since_id=".$since_id."&limit=".$limit."&fields=id,created_at,order_number,customer,note_attributes,email&name=".$ids."&created_at_max=".$created_at_max,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_DNS_USE_GLOBAL_CACHE=>false,
        CURLOPT_DNS_CACHE_TIMEOUT=>2,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => array(
            'Content-Type: application/json',
            'X-Shopify-Access-Token: '.$api_secret
          ),
        ));
      
      $response = curl_exec($curl);
      $err = curl_error($curl);
       $response=json_decode($response);
       $orderarray= array();
  foreach ($response->orders as  $key=>$allorders) 
  {
      $orderarray[$key]['id'] =$allorders->id;
      $orderarray[$key]['order_number'] =$allorders->order_number;
      $orderarray[$key]['email'] =$allorders->email;
      $orderarray[$key]['created_at'] =$allorders->created_at;
      $orderarray[$key]['first_name']=$allorders->customer->first_name;
      $orderarray[$key]['last_name']=$allorders->customer->last_name;
      if(!empty($allorders->note_attributes))
      {
        foreach ($allorders->note_attributes as  $notes) 
    {
        $orderarray[$key][$notes->name]=$notes->value;
    }
      
}
  }

  $options = new Options();
  $SHOPIFY_API_VERSION = env('SHOPIFY_API_VERSION', 2023-04);
  $options->setVersion($SHOPIFY_API_VERSION); 
  $api = new BasicShopifyAPI($options);
  $api->setSession(new Session($shop, $api_secret));
  $request = $api->graph('{
    shopLocales {
      locale
      name
      primary
      published
    }
  }')['body']['data']['shopLocales'];

  foreach ($request->container as $req) {
    $primary = 0;
    $published = 0;
    $locale = strtoupper($req['locale']);
    $checkrecords = DB::table('language_settings')->where('store_id', $shop_id)->where('Lang', $locale)->first();
    if (!$checkrecords) {

        if ($req['primary']) {
            $primary = 1;
        }
        if ($req['published']) {
            $published = 1;
        }
        DB::table('language_settings')->insert([
            ['store_id' => $shop_id, 'lang' => $locale, 'name' => $req['name'], 'published' => $published,
                'main' => $primary
            ],
        ]);
    } else {

        DB::table('language_settings')
        ->where('store_id', $shop_id)
        ->delete();

        if ($req['primary']) {
            $primary = 1;
        }
        if ($req['published']) {
            $published = 1;
        }
        DB::table('language_settings')->insert([
            ['store_id' => $shop_id, 'lang' => $locale, 'name' => $req['name'], 'published' => $published,
                'main' => $primary
            ],
        ]);
    }

}



 
       return response()->json(['success' => 'Orders List','data'=>$orderarray], $this->successStatus);
    }

    public function getcartpage(Request $request)
    {
        $checkrecord = DB::table('users')->where('name', request('shop'))->first();
    
        $shop = $checkrecord->name;
        $shop_id = $checkrecord->id;
        $api_secret = $checkrecord->password;
        $api_key = env('SHOPIFY_API_KEY', null);

//         $checkrecords = DB::table('setup')->where('store_id', $shop_id)->where('cart_push', 1)->first();
//         if (!$checkrecords) {



//         $curl = curl_init();
  
// curl_setopt_array($curl, array(
//   CURLOPT_URL => "https://".$api_key.":".$api_secret."@".$shop."/admin/api/2022-01/themes.json?role=main",
//   CURLOPT_RETURNTRANSFER => true,
//   CURLOPT_ENCODING => '',
//   CURLOPT_MAXREDIRS => 10,
//   CURLOPT_TIMEOUT => 0,
//   CURLOPT_FOLLOWLOCATION => true,
//   CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
//   CURLOPT_CUSTOMREQUEST => 'GET',
//   CURLOPT_HTTPHEADER => array(
//     'Content-Type: application/json',
//     'X-Shopify-Access-Token: '.$api_secret
//   ),
// ));

//     $themeresponse = curl_exec($curl);
//     $themeresponse = json_decode($themeresponse);
//     curl_close($curl);

// $theme_id = $themeresponse->themes[0]->id;
   

// $curl = curl_init();
// curl_setopt_array($curl, array(
//     CURLOPT_URL => "https://".$api_key.":".$api_secret."@".$shop."/admin/api/2022-01/themes/".$theme_id."/assets.json?asset%5Bkey%5D=sections%2Fcart-template.liquid",
//     CURLOPT_RETURNTRANSFER => true,
//     CURLOPT_ENCODING => '',
//     CURLOPT_MAXREDIRS => 10,
//     CURLOPT_TIMEOUT => 0,
//     CURLOPT_FOLLOWLOCATION => true,
//     CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
//     CURLOPT_CUSTOMREQUEST => 'GET',
   
//   CURLOPT_HTTPHEADER => array(
//     'Content-Type: application/json',
//     'X-Shopify-Access-Token: '.$api_secret
//   ),
//   ));

//   $responseimg = curl_exec($curl);
//   $responseimg = json_decode($responseimg);
//   $cart_code = $responseimg->asset->value;
//   $cart_code = explode('</form>',$cart_code);
//   $first_code = $cart_code[0]."{% include 'orderfield' %} </form>".$cart_code[1];
//   curl_close($curl);
//   $body = str_replace(array("\n", "\r"), '',$first_code);
//   $body = addslashes($body);
 
 
//   $curl = curl_init();
// curl_setopt_array($curl, array(
//     CURLOPT_URL => "https://".$api_key.":".$api_secret."@".$shop."/admin/api/2022-01/themes/".$theme_id."/assets.json",
//     CURLOPT_RETURNTRANSFER => true,
//     CURLOPT_ENCODING => '',
//     CURLOPT_MAXREDIRS => 10,
//     CURLOPT_TIMEOUT => 0,
//     CURLOPT_FOLLOWLOCATION => true,
//     CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
//     CURLOPT_CUSTOMREQUEST => 'PUT',
//     CURLOPT_POSTFIELDS =>'{
//     "asset": {
//       "key": "sections\/cart-template.liquid",
//       "value": "'.$body.'"
//     }
//   }',
//   CURLOPT_HTTPHEADER => array(
//     'Content-Type: application/json',
//     'X-Shopify-Access-Token: '.$api_secret
//   ),
//   ));

//   $responseimg = curl_exec($curl);

//   DB::table('setup')->insert([
//     ['store_id' => $shop_id, 'cart_push' =>1
//     ],
// ]);

// }
  return response()->json(['success' => 'Cart Page'], $this->successStatus);
    }

    
//     public function setcartpage(Request $request)
//     {

//         $api_key = env('SHOPIFY_API_KEY', null);
//         $checkrecord = DB::table('users')->where('name', request('shop'))->first();
      
//         $shop = $checkrecord->name;
//         $shopid = $checkrecord->id;
//         $api_secret = $checkrecord->password;
        
//         $body = str_replace(array("\n", "\r"), '',request('cartpage'));
      
// $curl = curl_init();
  
// curl_setopt_array($curl, array(
//   CURLOPT_URL => "https://".$api_key.":".$api_secret."@".$shop."/admin/api/2022-01/themes.json?role=main",
//   CURLOPT_RETURNTRANSFER => true,
//   CURLOPT_ENCODING => '',
//   CURLOPT_MAXREDIRS => 10,
//   CURLOPT_TIMEOUT => 0,
//   CURLOPT_FOLLOWLOCATION => true,
//   CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
//   CURLOPT_CUSTOMREQUEST => 'GET',
//   CURLOPT_HTTPHEADER => array(
//     'Content-Type: application/json',
//     'X-Shopify-Access-Token: '.$api_secret
//   ),
// ));

//     $themeresponse = curl_exec($curl);
//     $themeresponse = json_decode($themeresponse);
//     curl_close($curl);

// $theme_id = $themeresponse->themes[0]->id;
   


// $curl = curl_init();
// curl_setopt_array($curl, array(
//     CURLOPT_URL => "https://".$api_key.":".$api_secret."@".$shop."/admin/api/2022-01/themes/".$theme_id."/assets.json?asset%5Bkey%5D=sections%2Fcart-template.liquid",
//     CURLOPT_RETURNTRANSFER => true,
//     CURLOPT_ENCODING => '',
//     CURLOPT_MAXREDIRS => 10,
//     CURLOPT_TIMEOUT => 0,
//     CURLOPT_FOLLOWLOCATION => true,
//     CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
//     CURLOPT_CUSTOMREQUEST => 'GET',
   
//   CURLOPT_HTTPHEADER => array(
//     'Content-Type: application/json',
//     'X-Shopify-Access-Token: '.$api_secret
//   ),
//   ));

//   $responseimg = curl_exec($curl);
//   $responseimg = json_decode($responseimg);
//   $cart_code = $responseimg->asset->value;
  
//   curl_close($curl);


// $curl = curl_init();
// curl_setopt_array($curl, array(
//     CURLOPT_URL => "https://".$api_key.":".$api_secret."@".$shop."/admin/api/2022-01/themes/".$theme_id."/assets.json",
//     CURLOPT_RETURNTRANSFER => true,
//     CURLOPT_ENCODING => '',
//     CURLOPT_MAXREDIRS => 10,
//     CURLOPT_TIMEOUT => 0,
//     CURLOPT_FOLLOWLOCATION => true,
//     CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
//     CURLOPT_CUSTOMREQUEST => 'PUT',
//     CURLOPT_POSTFIELDS =>'{
//     "asset": {
//       "key": "sections\/cart-template.liquid",
//       "value": "'.$cart_code.'"
//     }
//   }',
//   CURLOPT_HTTPHEADER => array(
//     'Content-Type: application/json',
//     'X-Shopify-Access-Token: '.$api_secret
//   ),
//   ));

//   $responseimg = curl_exec($curl);
//  print_r($responseimg);
//   curl_close($curl);
//   return response()->json([
//     'status' => 200,
   
// ], 200);
//     }

    public function getfields(Request $request)
    {

        $checkrecord = DB::table('users')->where('name', request('shop'))->first();
    
        $shop = $checkrecord->name;

        $fields = DB::table('fields')
            ->select('*')
            ->where('shop_url', $shop)
            ->orderBy('field_order', 'ASC')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $fields,
        ], 200);

    }

    public function getactivefields(Request $request)
    {

        $checkrecord = DB::table('users')->where('name', request('shop'))->first();
      
        $shop = $checkrecord->name;

        $fields = DB::table('fields')
            ->select('*')
            ->where('shop_url', $shop)
            ->where('active', 1)
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $fields,
        ], 200);

    }

    public function enabledfield(Request $request)
    {

        $checkrecord = DB::table('users')->where('name', request('shop'))->first();
    
        $shop = $checkrecord->name;
        $status = $request->input('status');
        $id = $request->input('id');
        $sync = DB::table('fields')
            ->where('id', $id)
            ->update(['active' => $status]);

      

            return response()->json(['success' => "Field status changed successfully"], $this->successStatus); 

    }

    public function editfieldrequrl(Request $request)
    {

        $checkrecord = DB::table('users')->where('name', request('shop'))->first();
    
        $shop = $checkrecord->name;
        $status = $request->input('value');
        $id = $request->input('id');
        $sync = DB::table('fields')
            ->where('id', $id)
            ->update(['required' => $status]);

      

            return response()->json(['success' => "Field changed successfully"], $this->successStatus); 

    }

    public function deletefield(Request $request)
    {

        $checkrecord = DB::table('users')->where('name', request('shop'))->first();
    
        $shop = $checkrecord->name;
        $id = $request->input('id');
        DB::table('fields')
        ->where('id', request('id'))
        ->delete();

        DB::table('translation')
        ->where('field_id', request('id'))
        ->delete();
       
        return response()->json(['success' => "Field removed successfully"], $this->successStatus); 
    }

    public function savefield(Request $request)
    {

        $checkrecord = DB::table('users')->where('name', request('shop'))->first();
    
        $shop = $checkrecord->name;
        $shop_id = $checkrecord->id;
         $fieldsname = $request->input('fieldname');
         $handle = str_replace(" ", "_", strtolower($fieldsname));
         $field_type = $request->input('fieldtype');
         $dropvalues = $request->input('dropvalues');
          $active = $request->input('enb');
       

          $getplan = DB::table('charges')
          ->select('plan_id')
          ->where('status', 'Active')
          ->where('user_id', $shop_id)->first();
          
         if(empty($getplan->plan_id))
         {
          $plan_id = 1;
         } else {
          $plan_id = $getplan->plan_id;
         }

         if($plan_id == 1)
         {
            $fields = DB::table('fields')
            ->select('*')
            ->where('shop_url', $shop)
            ->get();
            if(count($fields) == 1)
            {
                return response()->json(['error' => "You need to upgrade the plan to add more fields"], $this->successStatus); 
            } else {
                DB::table('fields')->insert([
                    ['shop_url' => $shop, 'fieldsname' => $handle,  'field_type' => $field_type,'active' => $active,'dropvalues'=>$dropvalues 
                    ],
                ]);
                return response()->json(['success' => "Field added successfully"], $this->successStatus); 
            }

         }

         if($plan_id == 2)
         {
            $fields = DB::table('fields')
            ->select('*')
            ->where('shop_url', $shop)
            ->get();
            if(count($fields) >= 5)
            {
                return response()->json(['error' => "You need to upgrade the plan to add more fields"], $this->successStatus); 
            } else {
                DB::table('fields')->insert([
                    ['shop_url' => $shop, 'fieldsname' => $handle,  'field_type' => $field_type,'active' => $active,'dropvalues'=>$dropvalues  
                    ],
                ]);
                return response()->json(['success' => "Field added successfully"], $this->successStatus); 
            }

         }

         if($plan_id == 3)
         {
            $fields = DB::table('fields')
            ->select('*')
            ->where('shop_url', $shop)
            ->get();
            if(count($fields) >= 10)
            {
                return response()->json(['error' => "You can't add more than 10 fields"], $this->successStatus); 
            } else {
                DB::table('fields')->insert([
                    ['shop_url' => $shop, 'fieldsname' => $handle,  'field_type' => $field_type,'active' => $active, 'dropvalues'=>$dropvalues 
                    ],
                ]);
                return response()->json(['success' => "Field added successfully"], $this->successStatus); 
            }

         }

        

        
       
        
    }


    public function updatecartlayout(Request $request)
    {

        $background = $request->input('background');
      
        $textcolor = $request->input('textcolor');
      
        $font_style = $request->input('font_style');
       
        $checkrecord = DB::table('users')->where('name', request('shop'))->first();
        $store_id = $checkrecord->id;
        $checkrecord = DB::table('cart_layout')->where('store_id', $store_id)->first();
            if (!$checkrecord) {
                DB::table('cart_layout')->insert([
                    ['store_id' => $store_id, 'color' =>$textcolor,'bgcolor'=>$background,'font'=>$font_style],
                ]);

            } else {

                 DB::table('cart_layout')

                ->where('store_id', $store_id)
                ->update(['bgcolor' => $background, 'color' => $textcolor, 
                    'font' => $font_style]);
            }
        

            return response()->json(['success' => "Setting saved successfully"], $this->successStatus); 

    }

    public function getcartlayout(Request $request)
    {

        $checkrecord = DB::table('users')->where('name', request('shop'))->first();
      
        $shop = $checkrecord->name;
        $shopid = $checkrecord->id;
        $checkrecord = DB::table('cart_layout')->where('store_id', $shopid)->first();
        if (!$checkrecord) {
            $fields = array (
                'bgcolor' => '#07025eff',
                'font' => 'Josefin Sans',
                'color' => '#f5e90aff',
            );
            $fields = (object) $fields;
        }  else {
        $fields = DB::table('cart_layout')
            ->select('*')
            ->where('store_id', $shopid)
            ->first();

        }
          
        return response()->json([
            'status' => 200,
            'data' => $fields,
        ], 200);

    }

    public function setupdetails(Request $request)
    {

        $api_key = env('SHOPIFY_API_KEY', null);
        $checkrecord = DB::table('users')->where('name', request('shop'))->first();
        $all_active_shops = DB::table('users')->where('password', '!=' , null)->get();
        $shop = $checkrecord->name;
        $shopid = $checkrecord->id;
        $api_secret = $checkrecord->password;

        //print($all_active_shops);

        $body1= "{%- assign ofsname = 'ofs_' | append: shop.permanent_domain | replace: '.', '_' -%} {{ ofsname }}";


        $body1.= "{% case ofsname %}";
        foreach ($all_active_shops as $all_active_shop)
        {
        $body1.="{% when 'ofs_".str_replace('.', '_', $all_active_shop->name)."' %}  {% render 'ofs_".str_replace('.', '_', $all_active_shop->name)."' %}";
        }
        $body1.="{% endcase %}";
        
        $body1.='{% schema %}{"name": "Order Field Supreme","target": "section"}{% endschema %}';
         $path1 = base_path() . '/extensions/order-field-supreme/blocks/'; 
         $fileName1 ='app-block'.'.liquid';
         File::put($path1.$fileName1 , $body1);


        $checkrecord = DB::table('cart_layout')->where('store_id', $shopid)->first();
        if (!$checkrecord) {
            $layout = array (
                'bgcolor' => '#07025eff',
                'font' => 'Josefin Sans',
                'color' => '#f5e90aff',
            );
            $layout = (object) $layout;
        }  else {
        $layout = DB::table('cart_layout')
            ->select('*')
            ->where('store_id', $shopid)
            ->first();

        }
       
    

       
        
       
        $fields = DB::table('fields')
        ->select('*')
        ->where('shop_url', $shop)
        ->where('active', 1)
        ->orderBy('field_order', 'ASC')
        ->get();
       
        $getplan = DB::table('charges')
        ->select('plan_id')
        ->where('status', 'Active')
        ->where('user_id', $shopid)->first();
        
       if(empty($getplan->plan_id))
       {
        $plan_id = 1;
       } else {
        $plan_id = $getplan->plan_id;
       }
       

        $lang = DB::table('language_settings')
                ->select('*')
                ->where('store_id', $shopid)
                ->get();
                $body ='';

                $req ='';
                $reqradio='';
                $star ='';
                if(!empty($fields))
                {
        $body .= "<div class='cart-fields' style='margin-bottom:20px;width:45%;padding: 4%; font-family: ".$layout->font.";background:".$layout->bgcolor."'>";
 
        if($plan_id == 3)
        {
            
            if(!empty($lang))
        {
            
            foreach ($lang as $mylang)
            {
               $langname=strtolower($mylang->Lang);
               $body .=" {% if shop.locale == '".$langname."' %}  ";
              
               foreach ($fields as $field)
           
            { 
                $checkfield = DB::table('translation')->where('field_id', $field->id)->where('language', $mylang->Lang)->first();
                    if(!empty($checkfield->value))
                    {
                        $field_name = $checkfield->value;
                      
                    } else {
                        $field_name = $field->fieldsname;
                      
                    }
                    if(!empty($checkfield->dropvalues))
                    {
                        
                        $dropvalues = explode (',',$checkfield->dropvalues);
                    } else {
                       
                        $dropvalues = explode (',',$field->dropvalues);
                    }

                   $label = str_replace('_', ' ', $field_name);
                  
                   if($field->required == 1)
                   {
                       $req="required";
                       $star= '*';
                   } else {
                    $star= '';
                    $req='';
                }

                   if($field->field_type=="date") 
                   {
                       $body .="<div class='cart-attribute__field ' style='padding-bottom:10px;display:flex; flex-direction: row; justify-content: center; align-items: center'>
                       <label style='width: 100%;font-style: inherit;font-family: ".$layout->font.";color: ".$layout->color."' for='".$field_name."'>".ucwords($label)." ".$star."</label>
                       <input class='form-control' form='cart' style='border:1px solid;margin-left: 0px;width:100%;background:#ffffff'  ".$req."   id='".$field->fieldsname."' type='".$field->field_type."' name='attributes[".$field->fieldsname."]' value='{{ cart.attributes['".$field->fieldsname."'] }}'>
                       </div>";
                   } 
                   if($field->field_type=="checkbox") 
                   {
                       $body .="<div class='cart-attribute__field ' style='padding-bottom:10px;display:flex; flex-direction: row; justify-content: center; align-items: center'>
                      
                       <input ".$req." id='".$field->fieldsname."' type='".$field->field_type."' form='cart' name='attributes[".$field->fieldsname."]' value='Yes' {% if cart.attributes['".$field->fieldsname."'] == 'Yes' %} checked {% endif %}>
                       <label style='margin:0px;width: 100%;font-style: inherit;padding-left:20px;font-family: ".$layout->font.";color: ".$layout->color."' for='".$field->fieldsname."'>".ucwords($label)." ".$star."</label>
                       </div>";
                   }
                   if($field->field_type=="select") 
                   {
                      
                    $body .="<div class='cart-attribute__field ' style='padding-bottom:10px;display:flex; flex-direction: row; justify-content: center; align-items: center'>
                    <label style='width: 100%;font-style: inherit;font-family: ".$layout->font.";color: ".$layout->color."' for='".$field->fieldsname."'>".ucwords($label)." ".$star."</label>
                    <select ".$req." class='form-control' form='cart' style='background-color:#ffffff;margin-left: 0px;width:97%;' id='".$field->fieldsname."' name='attributes[".$field->fieldsname."]'>
                    <option value=''>Select</option>";
       
                    foreach($dropvalues as $drop)
                    {
                       $body .=" <option value='".$drop."' {% if cart.attributes['".$field->fieldsname."'] == '".$drop."' %} selected {% endif %}>".$drop."</option>";
                    }
                    $body .=" </select>
                    </div>";
                   }

                   if($field->field_type=="radio") 
                   {
                      
                    $body .="<div class='cart-attribute__field ' style='padding-bottom:10px;display:flex; flex-direction: row; justify-content: center; align-items: center'>
                    <label style='width: 100%;font-style: inherit;font-family: ".$layout->font.";color: ".$layout->color."' for='".$field->fieldsname."'>".ucwords($label)." ".$star."</label>
                    ";
                    $i=1;
                    foreach($dropvalues as $drop)
                    {
                        if($i==1)
                        {
                            $reqradio = $req;
                        } else {
                            $reqradio ="";
                        }
                        $body .=" <input  ".$reqradio." form='cart' class='form-control' style='margin-left: 0px;' id='".$field->fieldsname."' type='radio' name='attributes[".$field->fieldsname."]' value='".$drop."'  {% if cart.attributes['".$field->fieldsname."'] == '".$drop."' %}  checked {% endif %}> <span style='margin-right: 10px;font-style: inherit;font-family: ".$layout->font.";color: ".$layout->color."'>".$drop."</span><br>";
                       $i++;
                    }
                    $body .=" 
                    </div>";
                   }
            if($field->field_type=="text" || $field->field_type=="Integer") 
                   {
                   $body .="<div class='cart-attribute__field ' style='padding-bottom:10px;display:flex; flex-direction: row; justify-content: center; align-items: center'>
                   <label style='width: 100%;font-style: inherit;font-family: ".$layout->font.";color: ".$layout->color."' for='".$field->fieldsname."'>".ucwords($label)." ".$star."</label>
                   <input ".$req." class='form-control' form='cart' style='border:1px solid;margin-left: 0px;width: 100%;background:#ffffff' id='".$field->fieldsname."' type='text' name='attributes[".$field->fieldsname."]' value='{{ cart.attributes['".$field->fieldsname."'] }}'>
                   </div>";
                   }

                   if($field->field_type=="textarea") 
                   {
                   $body .="<div class='cart-attribute__field ' style='padding-bottom:10px;display:flex; flex-direction: row; justify-content: center; align-items: center'>
                   <label style='width: 100%;font-style: inherit;font-family: ".$layout->font.";color: ".$layout->color."' for='".$field->fieldsname."'>".ucwords($label)." ".$star."</label>
                   <textarea '".$req." class='form-control' form='cart' style='border:1px solid;background:#ffffff;margin-left: 0px;width:100%;-webkit-border-radius: 5px;-moz-border-radius: 5px;border-radius: 5px;' id='".$field->fieldsname."' name='attributes[".$field->fieldsname."]'>{{ cart.attributes['".$field->fieldsname."'] }}</textarea>
                   
                   
                   </div>";
                   }
                  
       
               }
               $body .=" {% endif %}";
           }
        } else {
            foreach ($fields as $field)
            {
                $label = str_replace('_', ' ', $field->fieldsname);

                if($field->required == 1)
                {
                    $req="required";
                    $star= '*';
                } else {

                    $req='';
                    $star= '';
                }

                if($field->field_type=="date") 
                {
                    $body .="<div class='cart-attribute__field ' style='padding-bottom:10px;display:flex; flex-direction: row; justify-content: center; align-items: center'>
                    <label style='width: 100%;font-style: inherit;font-family: ".$layout->font.";color: ".$layout->color."' for='".$field->fieldsname."'>".ucwords($label)." ".$star."</label>
                    <input '".$req." class='form-control' form='cart' style='border:1px solid;background:#ffffff;margin-left: 0px;width: 100%;' id='".$field->fieldsname."' type='".$field->field_type."' name='attributes[".$field->fieldsname."]' value='{{ cart.attributes['".$field->fieldsname."'] }}'>
                    </div>";
                } 
                if($field->field_type=="checkbox") 
                {
                    $body .="<div class='cart-attribute__field ' style='padding-bottom:10px;display:flex; flex-direction: row; justify-content: center; align-items: center'>
                   
                    <input '".$req." id='".$field->fieldsname."' type='".$field->field_type."' form='cart' name='attributes[".$field->fieldsname."]' value='Yes' {% if cart.attributes['".$field->fieldsname."'] == 'Yes' %} checked {% endif %}>
                    <label style='margin:0px;width: 100%;font-style: inherit;padding-left:20px;font-family: ".$layout->font.";color: ".$layout->color."' for='".$field->fieldsname."'>".ucwords($label)." ".$star."</label>
                    </div>";
                }
                if($field->field_type=="select") 
                {
                    $dropvalues = explode (',',$field->dropvalues);
                 $body .="<div class='cart-attribute__field ' style='padding-bottom:10px;display:flex; flex-direction: row; justify-content: center; align-items: center'>
                 <label style='width: 100%;font-style: inherit;font-family: ".$layout->font.";color: ".$layout->color."' for='".$field->fieldsname."'>".ucwords($label)." ".$star."</label>
                 <select ".$req." class='form-control' form='cart' style='background-color:#ffffff;margin-left: 0px;width:97%;' id='".$field->fieldsname."' name='attributes[".$field->fieldsname."]'>
                 <option value=''>Select</option>";
    
                 foreach($dropvalues as $drop)
                 {
                    $body .=" <option value='".$drop."' {% if cart.attributes['".$field->fieldsname."'] == '".$drop."' %} selected {% endif %} >".$drop."</option>";
                 }
                 $body .=" </select>
                 </div>";
                }
                if($field->field_type=="radio") 
                {
                    $dropvalues = explode (',',$field->dropvalues);
                 $body .="<div class='cart-attribute__field ' style='padding-bottom:10px;display:flex; flex-direction: row; justify-content: center; align-items: center'>
                 <label style='width: 100%;font-style: inherit;font-family: ".$layout->font.";color: ".$layout->color."' for='".$field->fieldsname."'>".ucwords($label)." ".$star."</label>
                 ";
    
                 $i=1;
                 foreach($dropvalues as $drop)
                 {
                     if($i==1)
                     {
                         $reqradio = $req;
                     }
                     else {
                        $reqradio ="";
                    }
                     $body .=" <input ".$reqradio." class='form-control' form='cart' style='margin-left: 0px;' id='".$field->fieldsname."' type='radio' name='attributes[".$field->fieldsname."]' value='".$drop."'  {% if cart.attributes['".$field->fieldsname."'] == '".$drop."' %}  checked {% endif %}> <span style='margin-right: 10px;font-style: inherit;font-family: ".$layout->font.";color: ".$layout->color."'>".$drop."</span><br>";
                    $i++;
                 }
                 $body .=" 
                 </div>";
                }

                if($field->field_type=="text" || $field->field_type=="Integer") 
                {
                $body .="<div class='cart-attribute__field ' style='padding-bottom:10px;display:flex; flex-direction: row; justify-content: center; align-items: center'>
                <label style='width: 100%;font-style: inherit;font-family: ".$layout->font.";color: ".$layout->color."' for='".$field->fieldsname."'>".ucwords($label)." ".$star."</label>
                <input ".$req." class='form-control' form='cart' style='border:1px solid;margin-left: 0px;width: 100%;background:#ffffff' id='".$field->fieldsname."' type='text' name='attributes[".$field->fieldsname."]' value='{{ cart.attributes['".$field->fieldsname."'] }}'>
                </div>";
                }
                if($field->field_type=="textarea") 
                {
                $body .="<div class='cart-attribute__field ' style='padding-bottom:10px;display:flex; flex-direction: row; justify-content: center; align-items: center'>
                <label style='width: 100%;font-style: inherit;font-family: ".$layout->font.";color: ".$layout->color."' for='".$field->fieldsname."'>".ucwords($label)." ".$star."</label>
                <textarea ".$req." class='form-control' form='cart' style='border:1px solid;background:#ffffff;margin-left: 0px;width:100%;-webkit-border-radius: 5px;-moz-border-radius: 5px;border-radius: 5px;' id='".$field->fieldsname."' name='attributes[".$field->fieldsname."]'>{{ cart.attributes['".$field->fieldsname."'] }}</textarea>
                
                
                </div>";
                }
    
            }


        }
        }
         else {

        foreach ($fields as $field)
        {
            $label = str_replace('_', ' ', $field->fieldsname);
            if($field->required == 1)
            {
                $req="required";
                $star= '*';
            } else {
                $star= '';
                $req='';
            }

            if($field->field_type=="date") 
            {
                $body .="<div class='cart-attribute__field ' style='padding-bottom:10px;display:flex; flex-direction: row; justify-content: center; align-items: center'>
                <label style='width: 100%;font-style: inherit;font-family: ".$layout->font.";color: ".$layout->color."' for='".$field->fieldsname."'>".ucwords($label)." ".$star."</label>
                <input ".$req." class='form-control' form='cart' style='border:1px solid;background:#ffffff;margin-left: 0px;width: 100%;' id='".$field->fieldsname."' type='".$field->field_type."' name='attributes[".$field->fieldsname."]' value='{{ cart.attributes['".$field->fieldsname."'] }}'>
                </div>";
            } 
            if($field->field_type=="checkbox") 
            {
                $body .="<div class='cart-attribute__field ' style='padding-bottom:10px;display:flex; flex-direction: row; justify-content: center; align-items: center'>
               
                <input ".$req."  id='".$field->fieldsname."' type='".$field->field_type."' form='cart' name='attributes[".$field->fieldsname."]' value='Yes' {% if cart.attributes['".$field->fieldsname."'] == 'Yes' %} checked {% endif %}>
                <label style='margin:0px;width: 100%;font-style: inherit;padding-left:20px;font-family: ".$layout->font.";color: ".$layout->color."' for='".$field->fieldsname."'>".ucwords($label)." ".$star."</label>
                </div>";
            }
            if($field->field_type=="select") 
            {
                $dropvalues = explode (',',$field->dropvalues);
             $body .="<div class='cart-attribute__field ' style='padding-bottom:10px;display:flex; flex-direction: row; justify-content: center; align-items: center'>
             <label style='width: 100%;font-style: inherit;font-family: ".$layout->font.";color: ".$layout->color."' for='".$field->fieldsname."'>".ucwords($label)." ".$star."</label>
             <select ".$req." class='form-control' form='cart' style='background-color:#ffffff;margin-left: 0px;width:97%;' id='".$field->fieldsname."' name='attributes[".$field->fieldsname."]'>
             <option value=''>Select</option>
             ";
            
             foreach($dropvalues as $drop)
             {
                $body .=" <option value='".$drop."' {% if cart.attributes['".$field->fieldsname."'] == '".$drop."' %} selected {% endif %}>".$drop."</option>";
             }
             $body .=" </select>
             </div>";
            }

            if($field->field_type=="radio") 
                {
                    $dropvalues = explode (',',$field->dropvalues);
                 $body .="<div class='cart-attribute__field ' style='padding-bottom:10px;display:flex; flex-direction: row; justify-content: center; align-items: center'>
                 <label style='width: 100%;font-style: inherit;font-family: ".$layout->font.";color: ".$layout->color."' for='".$field->fieldsname."'>".ucwords($label)." ".$star."</label>
                 ";
    
                 $i=1;
                 foreach($dropvalues as $drop)
                 {
                     if($i==1)
                     {
                         $reqradio = $req;
                     }
                     else {
                        $reqradio ="";
                    }
                     $body .=" <input ".$reqradio." type='radio' form='cart' class='form-control' style='margin-left: 0px;' id='".$field->fieldsname."' name='attributes[".$field->fieldsname."]' value='".$drop."'  {% if cart.attributes['".$field->fieldsname."'] == '".$drop."' %}  checked {% endif %}> <span style='margin-right: 10px;font-style: inherit;font-family: ".$layout->font.";color: ".$layout->color."'>".$drop."</span><br>";
                    $i++;
                 }
                 $body .=" 
                 </div>";
                }

            if($field->field_type=="text" || $field->field_type=="Integer") 
            {
            $body .="<div class='cart-attribute__field ' style='padding-bottom:10px;display:flex; flex-direction: row; justify-content: center; align-items: center'>
            <label style='width: 100%;font-style: inherit;font-family: ".$layout->font.";color: ".$layout->color."' for='".$field->fieldsname."'>".ucwords($label)." ".$star."</label>
            <input ".$req." class='form-control' form='cart' style='border:1px solid;background:#ffffff;margin-left: 0px;width: 100%;' id='".$field->fieldsname."' type='text' name='attributes[".$field->fieldsname."]' value='{{ cart.attributes['".$field->fieldsname."'] }}'>
            </div>";
            }
            if($field->field_type=="textarea") 
                {
                $body .="<div class='cart-attribute__field ' style='padding-bottom:10px;display:flex; flex-direction: row; justify-content: center; align-items: center'>
                <label style='width: 100%;font-style: inherit;font-family: ".$layout->font.";color: ".$layout->color."' for='".$field->fieldsname."'>".ucwords($label)." ".$star."</label>
                <textarea  ".$req."  class='form-control' form='cart' style='border:1px solid;background:#ffffff;margin-left: 0px;width:100%;-webkit-border-radius: 5px;-moz-border-radius: 5px;border-radius: 5px;' id='".$field->fieldsname."' name='attributes[".$field->fieldsname."]'>{{ cart.attributes['".$field->fieldsname."'] }}</textarea>
                
                
                </div>";
                }

        }
       
    }
    
       
       
    
$body .="</div><script async src='https://code.jquery.com/jquery-3.5.0.js'></script><script> $(function(e){ $('form').on('submit',function(e) { $('.cart-fields').find(':input').each(function() { if (!$(this).prop('required')) {  } else { if(this.type == 'checkbox') { if ($(this).is(':checked')) {} else{ alert('please fill the required fields'); e.preventDefault(e); return false;} }else if(this.type == 'radio'){if ($('input[name=".addcslashes('"\'+this.name+\'"','"')."]').is(':checked')) {} else{   alert('please fill the required fields'); e.preventDefault(e); return false;} } else{ if (!this.value) { alert('please fill the required fields'); e.preventDefault(e); return false;} } }});}); })</script>";


$body = str_replace(array("\n", "\r"), '', $body);

$path = base_path() . '/extensions/order-field-supreme/snippets/'; 
$shop_replace= str_replace('.', '_', $shop);

$fileName ='ofs_'.$shop_replace.'.liquid';


if (!file_exists($path)) {
mkdir($path, 0777, true);
}
//print($path.$fileName);

File::put($path.$fileName , $body);


// $process = new Process(['npm run deploy']);
// $process->run();
// if (!$process->isSuccessful()) {
//     throw new ProcessFailedException($process);
// }

// echo $process->getOutput();
//Process::run('npm run deploy');
//Artisan::call('run deploy');
}

   
// $SHOPIFY_API_VERSION = env('SHOPIFY_API_VERSION', 2023-04);

// $curl = curl_init();
// curl_setopt_array($curl, array(
//     CURLOPT_URL => "https://".$api_key.":".$api_secret."@".$shop."/admin/api/".$SHOPIFY_API_VERSION."/themes/".$theme_id."/assets.json",
//     CURLOPT_RETURNTRANSFER => true,
//     CURLOPT_ENCODING => '',
//     CURLOPT_MAXREDIRS => 10,
//     CURLOPT_TIMEOUT => 0,
//     CURLOPT_FOLLOWLOCATION => true,
//     CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
//     CURLOPT_CUSTOMREQUEST => 'PUT',
//     CURLOPT_POSTFIELDS =>'{
//     "asset": {
//       "key": "snippets\/orderfield.liquid",
//       "value": "'.$body.'"
//     }
//   }',
//   CURLOPT_HTTPHEADER => array(
//     'Content-Type: application/json',
//     'X-Shopify-Access-Token: '.$api_secret
//   ),
//   ));

  //$responseimg = curl_exec($curl);
 
 // curl_close($curl);
  return response()->json([
    'status' => 200,
   
], 200);
    }
     


    public function getplandetails(Request $request)
    {

        $checkrecord = DB::table('users')->where('name', request('shop'))->first();
    
        $shop = $checkrecord->name;
        $shop_id = $checkrecord->id;
        

        $getplan = DB::table('charges')
        ->select('plan_id')
        ->where('status', 'Active')
        ->where('user_id', $shop_id)->first();
      
       if(empty($getplan->plan_id))
       {
        $plan_id = 1;
       } else {
        $plan_id = $getplan->plan_id;
       }
      
     
      if($plan_id == 1 )
      {

        $sync = DB::table('fields')
        ->where('shop_url', $shop)
        ->update(['required' => 0]);

      }

      

      


     
        
       

       return response()->json(['success' => "Plan details","plan_id"=>$plan_id], $this->successStatus);
    }

    public function getlangdetails(Request $request)
    {
        $checkrecord = DB::table('users')->where('name', request('shop'))->first();
        $shop_id = $checkrecord->id;
        $lang = $request->query('lang');
        if (empty($lang)) {
            $stores = DB::table('language_settings')
                ->select('*')
                ->where('store_id', $shop_id)
                ->get();

        } else {

            $stores = DB::table('language_settings')
                ->select('*')
                ->where('Lang', $lang)
                ->where('store_id', $shop_id)
                ->first();

        }

        return response()->json([
            'status' => 200,
            'data' => $stores,
        ], 200);

    }

    public function updatefieldlabelurl(Request $request)
    {

        $lang = $request->input('lang');

        foreach ($request->input('myfields') as $key => $value) {

            $checkrecord = DB::table('translation')->where('field_id', $key)->where('language', '=', $lang)->first();
            if (!$checkrecord) {

                DB::table('translation')->insert([
                    ['field_id' => $key, 'language' => $lang, 'value' => $value,
                    ],
                ]);

            } else {

                DB::table('translation')
                    ->where('language', $lang)
                    ->where('field_id', $key)
                    ->update(['value' => $value]);

            }

        }
        if(!empty($request->input('mydropfields')))
        {
        foreach ($request->input('mydropfields') as $key => $value) {

            DB::table('translation')
            ->where('language', $lang)
            ->where('field_id', $key)
            ->update(['dropvalues' => $value]);

        }
    }

        return response()->json([
            'status' => 200,
        ], 200);

    }
    public function getplan(Request $request)
    {

        $checkrecord = DB::table('users')->where('name', request('shop'))->first();
    
        $shop = $checkrecord->name;
        $shop_id = $checkrecord->id;
        

        $getplan = DB::table('charges')
        ->select('plan_id')
        ->where('status', 'Active')
        ->where('user_id', $shop_id)->first();
        
       if(empty($getplan->plan_id))
       {
        $plan_id = 1;
       } else {
        $plan_id = $getplan->plan_id;
       }
      
       if($plan_id == 1)
       {
        $fields = DB::table('fields')
        ->select('*')
        ->where('shop_url', $shop)
        ->get();

        if($plan_id == 1 )
      {

        $sync = DB::table('fields')
        ->where('shop_url', $shop)
        ->update(['required' => 0]);

      }

        if(!empty($fields))
        {
            $i=1;
            foreach($fields as $field)
            {
                if($i== 1)
                {
                   

                } else {
                    DB::table('fields')
                    ->where('id', $field->id)
                    ->delete();
                }
                $i++;
            }
        }
        
       }
     

       if($plan_id == 2)
       {
        $fields = DB::table('fields')
        ->select('*')
        ->where('shop_url', $shop)
        ->get();

        if(!empty($fields))
        {
            $i=1;
            foreach($fields as $field)
            {
                if($i <= 5)
                {
                   

                } else {
                    DB::table('fields')
                    ->where('id', $field->id)
                    ->delete();
                }
                $i++;
            }
        }
        
       }

       if($plan_id == 3)
       {
        $fields = DB::table('fields')
        ->select('*')
        ->where('shop_url', $shop)
        ->get();

        if(!empty($fields))
        {
            $i=1;
            foreach($fields as $field)
            {
                if($i <= 10)
                {
                   

                } else {
                    DB::table('fields')
                    ->where('id', $field->id)
                    ->delete();
                }
                $i++;
            }
        }
        
       }

    //   $getplanfeatures = DB::table('plan_features')
    //   ->select('feature_id')
    //   ->where('plan_id' , "<=",$plan_id)->get();

      

    //   DB::table('user_features')
    //   ->where('user_id', $shop_id)
    //   ->delete();
     
    //   foreach ($getplanfeatures as $features)
    //   {

    //     DB::table('user_features')->insert([
    //       ['user_id' => $shop_id, 'feature_id' => $features->feature_id,
    //       ],
    //     ]);
    //   }
       

       return response()->json(['success' => "Plan details","plan_id"=>$plan_id], $this->successStatus);
    }
    public function getfieldsbystore(Request $request)
    {

        $checkrecord = DB::table('users')->where('name', request('shop'))->first();
    
        $shop = $checkrecord->name;
        $shop_id = $checkrecord->id;
        $lang = $request->input('lang');

        $fields = DB::table('fields')
            ->select('fields.id', 'fields.fieldsname', 
            DB::raw('(CASE when translation.dropvalues IS NULL THEN fields.dropvalues  ELSE translation.dropvalues END )AS dropvalues'),
            'translation.value')
            ->leftJoin('translation', function ($join) use ($lang) {
                $join->on('translation.field_id', '=', 'fields.id');
                $join->where('translation.language', '=', $lang);
            })
            ->where('fields.shop_url', $shop)
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $fields,
        ], 200);

    }

    public function editfieldorderurl(Request $request)
    {
        $allitems = $request->input('allitems');
        

        foreach ($allitems as $key => $items) {

            $sync = DB::table('fields')
                ->where('id', $items['id'])
                ->where('shop_url', request('shop'))
                ->update(['field_order' => $key]);
        }

        return response()->json([
            'status' => 200,
        ], 200);

    }

    public function exportorders(Request $request)
    {
        $api_key = env('SHOPIFY_API_KEY', null);
        $checkrecord = DB::table('users')->where('name', request('shop'))->first();
    
        $shop = $checkrecord->name;
        $shop_id = $checkrecord->id;

        $getplan = DB::table('charges')
        ->select('plan_id')
        ->where('status', 'Active')
        ->where('user_id', $shop_id)->first();
        
       if(empty($getplan->plan_id))
       {
        $plan_id = 1;
       } else {
        $plan_id = $getplan->plan_id;
       }

      
       $SHOPIFY_API_VERSION = env('SHOPIFY_API_VERSION', 2023-04);

        $api_secret = $checkrecord->password;
        $api_key = env('SHOPIFY_API_KEY', null);
        $options = new Options();
        $options->setVersion($SHOPIFY_API_VERSION);
        $api = new BasicShopifyAPI($options);
        $api->setSession(new Session($shop, $api_secret));

        $orderarray= array();
        $fields = DB::table('fields')
        ->select('*')
        ->where('shop_url', $shop)
        ->get();

       if($plan_id == 1) 
       {
        return response()->json(['success' => 'Orders List','data'=>""], $this->successStatus);
       }
        if($plan_id == 2) {
        $request = $api->graph('{
            orders(first: 10 ,sortKey:ID,reverse:true) {
              edges {
                node {
                  id
                  name
                  createdAt
                  email
                  customer {
                    firstName
                    lastName
                  }
                  customAttributes {
                    key
                    value
                  }
                }
              }
            }
          }');

          $response = $request['body']['container']['data']['orders'];
       if(!empty($response['edges'])) {
                foreach ($response['edges'] as  $key=>$allorders) 
                {
                    $orderarray[$key]['id'] =$allorders['node']['id'];
                    $orderarray[$key]['Order No'] =$allorders['node']['name'];
                    $orderarray[$key]['Order Date'] =$allorders['node']['createdAt'];
                    $orderarray[$key]['First Name'] =$allorders['node']['customer']['firstName'];
                    $orderarray[$key]['Last Name'] =$allorders['node']['customer']['lastName'];
                    $orderarray[$key]['Email'] =$allorders['node']['email'];
                    foreach ($fields as $fid)
                    {
                        $orderarray[$key][$fid->fieldsname] ="";
                    }
                    
                    if(!empty($allorders['node']['customAttributes']))
                    {
                        foreach ($allorders['node']['customAttributes'] as  $notes) 
                    {
                        $orderarray[$key][$notes['key']] = $notes['value'];
                    }
                    
                }
                }

            } 
        }

                if($plan_id == 3) { 

        
                        $since_id = 0;

                        $myresponse = array();
                        $SHOPIFY_API_VERSION = env('SHOPIFY_API_VERSION', 2023-04);

                        while ($since_id >= 0)
                        {
                            $curl = curl_init();
                            curl_setopt_array($curl, array(
                                CURLOPT_URL => "https://" . $api_key . ":" . $api_secret . "@" . $shop . "/admin/api/2023-07/orders.json?status=any&since_id=" . $since_id . "&limit=250",
                                CURLOPT_RETURNTRANSFER => true,
                                CURLOPT_ENCODING => "",
                                CURLOPT_MAXREDIRS => 10,
                                CURLOPT_TIMEOUT => 30,
                                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                                CURLOPT_DNS_USE_GLOBAL_CACHE => false,
                                CURLOPT_DNS_CACHE_TIMEOUT => 2,
                                CURLOPT_CUSTOMREQUEST => "GET",
                                CURLOPT_HTTPHEADER => array(
                                    'Content-Type: application/json',
                                    'X-Shopify-Access-Token: '.$api_secret
                                  ),
                                ));
                                

                            $response = curl_exec($curl);
                            $err = curl_error($curl);
                            $response = json_decode($response);

                            if (!empty($response->orders))
                            {
                                $myresponse = array_merge($myresponse, (array)$response->orders);

                                $last = array_slice($response->orders, -1) [0];
                                $since_id = $last->id;
                            }
                            else
                            {
                                break;
                            }

                        }
                        $response = new \stdClass();
                        $response->orders = $myresponse;


                        $orderarray= array();
                        if (!empty($response->orders))
                        {

                                foreach ($response->orders as  $key=>$allorders) 
                                {
                                $orderarray[$key]['id'] =$allorders->admin_graphql_api_id;
                                $orderarray[$key]['Order No'] =$allorders->order_number;
                                
                                $orderarray[$key]['Order Date'] =$allorders->created_at;
                                $orderarray[$key]['First Name']=$allorders->customer->first_name;
                                $orderarray[$key]['Last Name']=$allorders->customer->last_name;
                                $orderarray[$key]['Email'] =$allorders->email;
                                foreach ($fields as $fid)
                                    {
                                        $orderarray[$key][$fid->fieldsname] ="";
                                    }

                                    if(!empty($allorders->note_attributes))
                                    {
                                            foreach ($allorders->note_attributes as  $notes) 
                                        {
                                            $orderarray[$key][$notes->name]=$notes->value;
                                        }
                                    
                                    }
                                }
                                array_multisort($orderarray, SORT_DESC, $response->orders);
                            }

    }

 
       return response()->json(['success' => 'Orders List','data'=>$orderarray], $this->successStatus);
    }

    public function savedsearch(Request $request)
    {

        $fieldsname = $request->input('fieldsname');
      
        $order_by = $request->input('order_by');
      
       
       
        $checkrecord = DB::table('users')->where('name', request('shop'))->first();
        $store_id = $checkrecord->id;
        $checkrecord = DB::table('saved_search')->where('store_id', $store_id)->first();
            if (!$checkrecord) {
                DB::table('saved_search')->insert([
                    ['store_id' => $store_id, 'fieldsname' =>$fieldsname,'order_by'=>$order_by],
                ]);

            } else {

                 DB::table('saved_search')

                ->where('store_id', $store_id)
                ->update(['fieldsname' => $fieldsname, 'order_by' => $order_by]);
            }
        

            return response()->json(['success' => "Search Setting saved successfully"], $this->successStatus); 

    }

    public function getsavedsearch(Request $request)
    {

        $checkrecord = DB::table('users')->where('name', request('shop'))->first();
      
      
        $store_id = $checkrecord->id;
        $search = DB::table('saved_search')
            ->select('*')
            ->where('store_id', $store_id)
            ->first();

        return response()->json([
            'status' => 200,
            'data' => $search,
        ], 200);

    }

    public function addvisits(Request $request)
    {
         $store = $request->input('shop');


        
        
        
          $menu = $request->input('menu');

          $submenu = $request->input('submenu');
          $page_time = $request->input('milisecond');

        $location="";
        // $link = url()->current();
           $user_ip = $_SERVER['REMOTE_ADDR'];
           if($user_ip == "127.0.0.1" || empty($user_ip))
           {
            $sendip='';
           } else {
              $sendip = $user_ip; 
           }

           $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://ip-api.io/json/".$sendip,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_DNS_USE_GLOBAL_CACHE=>false,
        CURLOPT_DNS_CACHE_TIMEOUT=>2,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => array(
          "cache-control: no-cache",
          "content-type: application/json",
          "postman-token:  8abea7fc2ca6b1d35184a5bd9dc548ea"
        ),
      ));
      
      $response = curl_exec($curl);
      $err = curl_error($curl);


           //$jsondata = file_get_contents("https://ip-api.io/json/" . $sendip);
          
           $data = json_decode($response, true);
           
           if(isset($data['country_name'])) {
                 $location = $data['country_name'];
           }
         
           $query=  DB::table('visits')->insert([
                ['store' => $store, 'visited_at'=>now(),'location'=>$location,'ip'=>$user_ip,'menu'=>$menu,'submenu'=>$submenu,'page_time'=>$page_time,
                ],
            ]);
        
            return response()->json([
                'status' => 200,
              
            ], 200);

    }

    public function getvisits(Request $request)
    {

        $visits = DB::table('visits')
        ->select('*')
        ->orderBy('visited_at', 'desc')
        ->get();
        

        $today_visits = DB::table('visits')
        ->select('*')
        ->whereDate('visited_at', date('Y-m-d'))
        ->count();

        $unique_visits = DB::table('visits')
        ->select(DB::raw('count(*) as user_count'))
        ->groupBy('ip')
        ->get();


        return response()->json([
            'status' => 200,
            'data' => $visits,
            'today_visit' =>$today_visits,
            'total_visits' => count($visits),
            'unique_visits' => count($unique_visits),

          
        ], 200);
    }

    public function addstorerecord(Request $request)
    {

      
        $store = $request->input('shop');
        $checkrecord = DB::table('users')->where('name', $store)->first();
    
        $shop = $checkrecord->name;
       
        $api_secret = $checkrecord->password;
        $api_key = env('SHOPIFY_API_KEY', null);
        $app_name = env('APP_NAME', null);
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => "https://".$api_key.":".$api_secret."@".$shop."/admin/shop.json",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_DNS_USE_GLOBAL_CACHE=>false,
        CURLOPT_DNS_CACHE_TIMEOUT=>2,
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => array(
          "cache-control: no-cache",
          "content-type: application/json",
          "postman-token:  8abea7fc2ca6b1d35184a5bd9dc548ea"
        ),
      ));
      
      $response = curl_exec($curl);
      $err = curl_error($curl);
       $response=json_decode($response);

      // print_r($response->shop);die;


        DB::connection('mysql_second')->table('records')->insertOrIgnore([
            ['app' => $app_name, 'store' => $response->shop->domain,'shopify_domain'=>$response->shop->myshopify_domain, 'email' =>$response->shop->email, 'phone' => $response->shop->phone, 'address1' => $response->shop->address1,'country' => $response->shop->country,
            'province' => $response->shop->province,'zip' => $response->shop->zip,'city' => $response->shop->city,
            ],
        ]);

        return response()->json([
            'status' => 200,
          
        ], 200);

    }
}