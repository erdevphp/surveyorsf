<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class TopometryController extends AbstractController
{
    #[Route('/topometry', name: 'topometry')]
    public function index(): Response
    {
        return $this->render('topometry/index.html.twig', [
            'controller_name' => 'TopometryController',
        ]);
    }
}
