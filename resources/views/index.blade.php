<?php
$domain=$_SERVER['REQUEST_URI'] ;
$path = explode("/", $domain); 
header("Content-Security-Policy: frame-ancestors https://".end($path)." "."https://admin.shopify.com");

?>

<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
         <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ env('APP_NAME') }}</title>
        <link href="{{ asset('css/app.css') }}" rel="stylesheet">
        <link href="{{ asset('css/mystyle.css') }}" rel="stylesheet">
      

<!-- Start Open Web Analytics Tracker -->
<script type="text/javascript">
//<![CDATA[
var owa_baseUrl = 'https://analytics.arcafy.com/';
var owa_cmds = owa_cmds || [];
owa_cmds.push(['setSiteId', '211be05f8fadd69f19089fb173cf0d9d']);
owa_cmds.push(['trackPageView']);
owa_cmds.push(['trackClicks']);
owa_cmds.push(['trackDomStream']);

(function() {
    var _owa = document.createElement('script'); _owa.type = 'text/javascript'; _owa.async = true;
    owa_baseUrl = ('https:' == document.location.protocol ? window.owa_baseSecUrl || owa_baseUrl.replace(/http:/, 'https:') : owa_baseUrl );
    _owa.src = owa_baseUrl + 'modules/base/dist/owa.tracker.js';
    var _owa_s = document.getElementsByTagName('script')[0]; _owa_s.parentNode.insertBefore(_owa, _owa_s);
}());
//]]>
</script>
<!-- End Open Web Analytics Code -->

        

   

        


    </head>
    <body>
    <div class="content text-center">
            <div id="app">
           
            <div id="loading" style="text-align:center" class=" text-center">
  <img id="loading-image" src="{{ asset('assets/images/Spinner-2.gif') }}" alt="Loading..." />
</div>
            </div>

            <p style="text-align:center">Order Fields Supreme -  Powered by Arcafy</p>
            </div>
            <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link href="{{ asset('css/mystyle.css') }}" rel="stylesheet">
    <script src="{{ asset('js/app.js') }}"></script>
   

   </body>
</html>

@section('scripts')
    @parent

    @if(config('shopify-app.appbridge_enabled'))
        <script>
           // actions.TitleBar.create(app, { title: 'Welcome' });
        </script>
    @endif
@endsection