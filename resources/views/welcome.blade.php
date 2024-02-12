@extends('shopify-app::layouts.default')

@section('styles')
   

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

        

   

        

    <style>
        html, body {
            background-color: #fff;
            color: #636b6f;
            font-family: 'Raleway', sans-serif;
            font-weight: 100;
            height: 100vh;
            margin: 0;
        }
        .full-height {
            height: 100vh;
        }
        .flex-center {
            align-items: center;
            display: flex;
            justify-content: center;
        }
        .position-ref {
            position: relative;
        }
        .top-right {
            position: absolute;
            right: 10px;
            top: 18px;
        }
        .content {
            text-align: center;
        }
        .title {
            font-size: 84px;
        }
        .links > a {
            color: #636b6f;
            padding: 0 25px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: .1rem;
            text-decoration: none;
            text-transform: uppercase;
        }
        .m-b-md {
            margin-bottom: 30px;
        }
    </style>
@endsection

@section('content')
   
        <div class="content">
        
            <div id="app" >
            <div id="loading" class="row text-center">
  <img id="loading-image" src="{{ asset('assets/images/Spinner-2.gif') }}" alt="Loading..." />
</div> 
            </div>
             
            <p>Order Fields Supreme - Powered by Arcafy</p>
            
            <div id="props" data-entityId="{{ Auth::user()->id }}"></div>
            <div id="shop" data-entityId="{{ Auth::user()->name}}"></div>



            <div class="links">
                <!-- <a href="https://github.com/osiset/laravel-shopify" target="_blank">Package</a>
                <a href="https://laravel.com" target="_blank">Laravel</a>
                <a href="https://github.com/osiset/laravel-shopify" target="_blank">GitHub</a> -->
            </div>
        </div>
    
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link href="{{ asset('css/mystyle.css') }}" rel="stylesheet">
    <script src="{{ asset('js/app.js') }}"></script>
@endsection

@section('scripts')
    @parent

    <script type="text/javascript">
        var AppBridge = window['app-bridge'];
        var actions = AppBridge.actions;
        var TitleBar = actions.TitleBar;
        var Button = actions.Button;
        var Redirect = actions.Redirect;
        var titleBarOptions = {
            title: 'Home',
        };
//        var myTitleBar = TitleBar.create(app, titleBarOptions);
    </script>
@endsection

<style>
#loading {
  width: 100%;
  height: 100%;
  top: 150px;
  left: 0;
  position: fixed;
  display: block;
  opacity: 0.7;
  background-color: #fff;
  z-index: 99;
  text-align: center;
}

#loading-image {
 
  left: 240px;
  z-index: 100;
}
    </style>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
    <script>
       $(window).load(function() {
    $('#loading').hide();
  });

    </script>