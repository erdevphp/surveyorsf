<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SIGController extends AbstractController
{
    #[Route('/sig', name: 'sig')]
    public function index(): Response
    {
        return $this->render('sig/index.html.twig');
    }
}
