<?php

$id = $_REQUEST['id'];
$do = $_REQUEST['action'];

if ($do == 'get') {
    echo file_get_contents($id.".html"); 
} else if ($do == 'getXml') {
    echo file_get_contents($id.".geshi");		
} else if ($do == 'put') {
    //Do Nothing
} else if ($do == 'getTree') {
    echo file_get_contents($id.".tree");
}
?>
