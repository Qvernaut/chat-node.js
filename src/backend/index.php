<?php

require 'vendor/autoload.php';

$app = new Slim\App();

$app->get('/', function () {
    echo 'This is home page';
});

$app->run();
