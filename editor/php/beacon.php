<?
/**
* Beacon - API (PHP)
* 
* Copyright (c) Beacon Dev Team
* Licensed under GPLv3
* 
* Plugins belong to their respective
* authors as mentioned.
*
*/

class Beacon {

    var $settings;
    var $phppath;
    
    var $request;

    function Beacon($confFile, $request) {
        $this->readSettings($confFile);
        
        $this->request = $request;
    }

    function init() {
        $html = '';
        
        if ($this->settings->isRoot) {
            $html = file_get_contents($this->phppath . "templates/beaconfull.html");
        } else {
            
        }
        
        return $html;
    }

    function newdoc() {
        
    } 

    function editdoc() {

    }
    
    function readSettings($confFile) {
        $this->settings = json_decode(file_get_contents($confFile));

        $this->phppath = $this->settings->path . $this->settings->php->path;
    }

    function url($url) {
        return $beaconSettings->path . $url;
    }

};

?>