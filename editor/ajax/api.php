<?php

require_once 'storage/Storage.php';
require_once 'storage/FlatFile.php';

$ret = "-1";
$storage = new BeaconFlatFile();

if (isset($_POST['action'])) {
	switch ($_POST['action']) {
	case 'new':
		$ret = $storage->newDocument($_POST['content']);
		break;
	case 'edit':
		if (isset($_POST['id']) && isset($_POST['content']))
			$ret = $storage->updateDocument($_POST['id'], $_POST['content']);
		break;
	case 'fetch':
		if (isset($_POST['id'])) {
			$raw = $storage->fetchDocument($_POST['id']);
			
			$tSrc = new DOMDocument();
			$tSrc->loadXML($raw);
			$tXSL = new XSLTProcessor();
			$tXSL->importStyleSheet(DOMDocument::load('../plugins/guidexml/xml/src2dst.xsl'));
			$ret = $tXSL->transformToXML($raw);
		}
		break;
	default:
		break;
	}
}

echo $ret;

?>