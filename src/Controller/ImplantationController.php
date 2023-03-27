<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ImplantationController extends AbstractController
{
    #[Route('/implantation', name: 'implantation')]
    public function index(): Response
    {
        return $this->render('implantation/index.html.twig');
    }
}
