<?php

//if ($_GET['s'] != 'fb8d4f601a5a0581162dae52e87d9796') die("Ah ah ah, you didn't say the magic word.");

$file = file_get_contents('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=ALL&key=QLLD-ZSYG-ES6T-K7EI&l=1');
$xml = simplexml_load_string($file);
header('Content-type: application/json');
echo stripslashes(json_encode($xml));

?>
