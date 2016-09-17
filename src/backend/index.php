<?php

require 'vendor/autoload.php';

$app = new Slim\App();
$DB = DBConnection();

$app->post('/registration', function () use ($app, $DB) {


    $sth = $DB->prepare("SELECT users.login FROM users WHERE login = :login");
    $sth->bindParam("login", $_REQUEST['login']);
    $sth->execute();
    $todos = $sth->fetchObject();

    if($todos->login) {
        exit(json_encode(["status" => false, "error" => "user already exists"]));
    }

    $sth = $DB->prepare("INSERT INTO users (login, password) VALUE (:login, :password)")    ;
    $sth->bindParam("login", $_REQUEST['login']);
    $sth->bindParam("password", password_hash($_REQUEST['password'], PASSWORD_DEFAULT));
    $sth->execute();

    exit(json_encode(["status" => true]));
});

$app->post('/login', function () use ($app, $DB) {
    $sth = $DB->prepare("SELECT users.password FROM users WHERE login = :login");
    $sth->bindParam("login", $_REQUEST['login']);
    $sth->execute();
    $todos = $sth->fetchObject();

    if(password_verify($_REQUEST['password'], $todos->password)) {
        exit(json_encode(["status" => true]));
    } else {
        exit(json_encode(["status" => false, "error" => "wrong login or password"]));
    }
});

function DBConnection() {
    return new PDO('mysql:dbhost=localhost;dbname=chat-node.js', 'root', '');
}

$app->run();
