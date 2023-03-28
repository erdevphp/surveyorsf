<?php

namespace App\Twig\Runtime;

use App\Service\RouteActiveService;
use Twig\Extension\RuntimeExtensionInterface;

class ActiveLinkExtensionRuntime implements RuntimeExtensionInterface
{
    private $em;
    public function __construct(private RouteActiveService $routeActiveService)
    {
        // Inject dependencies if needed
        
    }

    public function doSomething($value, string $cssActiveClass = 'secondary', string $cssNotActiveClass = 'dark')
    {
        $this->routeActiveService->linkActive($value, $cssActiveClass, $cssNotActiveClass);
    }
}
