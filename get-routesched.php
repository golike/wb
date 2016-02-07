<?php

$file = file_get_contents('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=ALL&key=QLLD-ZSYG-ES6T-K7EI&l=1');
$xml = simplexml_load_string($file);
header('Content-type: application/json');
echo stripslashes(json_encode($xml));

?>
