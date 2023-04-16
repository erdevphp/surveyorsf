<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HydrologyController extends AbstractController
{
    #[Route('/', name: 'hydrology')]
    public function index(): Response
    {
        return $this->render('hydrology/index.html.twig');
    }
}
