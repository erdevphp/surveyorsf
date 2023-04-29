<?php

namespace App\Twig\Runtime;

use Symfony\Component\HttpFoundation\RequestStack;
use Twig\Extension\RuntimeExtensionInterface;

class ActiveLinkExtensionRuntime implements RuntimeExtensionInterface
{
    public function __construct(private RequestStack $requestStack) {}

    public function doSomething($value, string $cssActiveClass = 'secondary', string $cssNotActiveClass = 'dark')
    {
        return ( $this->requestStack->getCurrentRequest()->get('_route') === $value ) ? $cssActiveClass : $cssNotActiveClass;
    }
}
