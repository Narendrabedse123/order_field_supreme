<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Osiset\ShopifyApp\Objects\Values\ShopDomain;

class AddContentSecurityPolicyHeader
{
    protected const ADMIN_SHOPIFY_URL = 'https://admin.shopify.com';

    protected const HEADER_FORMAT = 'frame-ancestors %s %s';

    public function handle(Request $request, Closure $next)
    {
        /** @var Response|RedirectResponse $response */
        $response = $next($request);

        // If it's not a redirect response and it's not Ajax
        if ($response instanceof Response && !$request->ajax()) {
            // If the request contains shop data, get the shop data
            if ($request->has('shop')) {
                $shopDomain = ShopDomain::fromNative($request->get('shop'));
            } elseif ($request->user() instanceof User) {
                // Get from user data
                $shopDomain = $request->user()->getDomain();
            } else {
                // If you still can't get it, get it from the request data.
                $shopDomain = ShopDomain::fromRequest($request);
            }

            if ($shopDomain instanceof ShopDomain) {
                $response->header('Content-Security-Policy', sprintf(self::HEADER_FORMAT, 'https://' . $shopDomain->toNative(), self::ADMIN_SHOPIFY_URL));
            }
        }

        return $response;
    }
}