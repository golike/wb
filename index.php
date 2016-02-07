<?php
    if ($_SERVER[HTTP_HOST] === 'localhost:1337') {
        $libPath = 'http://localhost:1337/lib/';
    } else {
        $libPath = 'http://wheresbart.net/lib/';
        $min = '.min';
    }
?>

<!doctype html>
<html>
	<head>
		<meta charset="utf-8"/>
		<meta name='viewport' content='initial-scale=1,maximum-scale=1,user-scalable=no'/>
		<title>Where&rsquo;s BART?</title>
        <link rel="stylesheet" href="<?php echo $libPath; ?>reset.min.css"/>
        <link rel='stylesheet' href='<?php echo $libPath; ?>leaflet/leaflet.css'/>
		<link rel="stylesheet" href="style.min.css"/>
		<link rel="apple-touch-icon" href="wheresbart.png"/>
	</head>
	<body>
		<div id="app">
            <div id="map"></div>
            <div id="list"></div>
            <!--
            <div id="settings">
                <h5>Destination</h5>
                <select id="destination"></select>
            </div>
            -->
        </div>
		<script src="<?php echo $libPath; ?>d3.min.js"></script>
        <script src="<?php echo $libPath; ?>ui.min.js"></script>
        <script src="<?php echo $libPath; ?>leaflet/leaflet.js"></script>
        <script src="code<?php echo $min; ?>.js"></script>
	</body>
</html>
