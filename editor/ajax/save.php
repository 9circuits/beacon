<?php

/* TODO: Add a database wrapper */

$text = urldecode($_POST['text']);
$text = stripslashes($text);
$id = urldecode($_POST['id']);

$html = fopen($id.".html", "w+");

fwrite($html, $text);

fclose($html);

echo $text;
?>
