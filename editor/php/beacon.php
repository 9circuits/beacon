<?
/**
* Beacon - API (PHP)
*
* Copyright (c) Beacon Dev Team
* Licensed under GPLv3
*
*/

include "parser.php";
include "storage/FlatFile.php";

class Beacon
{

    function Beacon($confFile, $request, $fullPath) {
        $this->request = $request;
        $this->confFile = $confFile;
        $this->fullPath = $fullPath;

        $this->readSettings($confFile);

        $this->pages = include $this->i18npath . "en_US.inc";
    }

    function init() {
        $html = '';

        if ($this->settings->isRoot) {
            // Get the localized page
            $html = $this->localizeHTML("beaconfull.html");

            // Replace some config items
            $html = str_replace("{themename}", $this->settings->theme, $html);
            $html = str_replace("{pathtoconf}", $this->settings->url . $this->confFile, $html);
        }

        // Return
        return $html;
    }

    function fetchui() {
        // Get the localized UI
        $html = $this->localizeHTML("beaconui.html");

        $html = str_replace("{handler}", $this->settings->url . $this->settings->php->handler, $html);

        // Return
        return $html;
    }

    function newdoc() {
        $id = $this->request->payload->id;
        $plugin = $this->request->payload->plugin;

        include $this->pluginpath . $plugin . "/php/" . $plugin . ".php";

        $beacon->path = $this->pluginpath . $plugin . "/";
        $beacon->url = $this->settings->url . $this->settings->php->pluginpath . $plugin . "/";
        $beacon->parser = new BeaconParser();

        $text = newdoc($beacon);

        if ($this->settings->storage === "flatfile") {
            $storage = new BeaconFlatFile($this->phppath . "storage/tmp/");
            $storage->createDocument($id, $text);
        }

        $html = $this->localizeHTML("document.html");
        $html = str_replace("{id}", $id, $html);
        $html = str_replace("{src}",
            $this->settings->url . $this->settings->php->path . "storage/tmp/" . $id . ".html", $html);

        return $html;
    }

    function editdoc() {
        $html = $this->localizeHTML("document.html");
        $html = str_replace("{id}", $id, $html);
        $html = str_replace("{src}",
            $this->settings->url . $this->settings->php->path . "storage/tmp/" . $id . ".html", $html);

    }

    function fetchdoc() {
        $id = $this->request->payload->id;
        $plugin = $this->request->payload->plugin;
        $url = $this->request->payload->url;

        // create curl resource
        $ch = curl_init();
        // set url
        curl_setopt($ch, CURLOPT_URL, $url);
        //return the transfer as a string
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        // $output contains the output string
        $src = curl_exec($ch);
        // close curl resource to free up system resources
        curl_close($ch);

        include $this->pluginpath . $plugin . "/php/" . $plugin . ".php";

        $beacon->path = $this->pluginpath . $plugin . "/";
        $beacon->url = $this->settings->url . $this->settings->php->pluginpath . $plugin . "/";
        $beacon->src = urldecode($src);
        $beacon->parser = new BeaconParser();
        $beacon->wrap = true;

        $text = gethtml($beacon);

        if ($this->settings->storage === "flatfile") {
            $storage = new BeaconFlatFile($this->phppath . "storage/tmp/");
            $storage->createDocument($id, $text);
        }

        $html = $this->localizeHTML("document.html");
        $html = str_replace("{id}", $id, $html);
        $html = str_replace("{src}",
            $this->settings->url . $this->settings->php->path . "storage/tmp/" . $id . ".html", $html);

        return $html;
    }

    function upload($id, $plugin, $src) {
        include $this->pluginpath . $plugin . "/php/" . $plugin . ".php";

        $beacon->path = $this->pluginpath . $plugin . "/";
        $beacon->url = $this->settings->url . $this->settings->php->pluginpath . $plugin . "/";
        $beacon->src = urldecode($src);
        $beacon->parser = new BeaconParser(true);
        $beacon->wrap = true;

        $text = gethtml($beacon);

        if ($this->settings->storage === "flatfile") {
            $storage = new BeaconFlatFile($this->phppath . "storage/tmp/");
            $storage->createDocument($id, $text);
        }

        return '<script language="javascript" type="text/javascript">
            window.top.window.beacon.uploadDone("'.$id.'", "'.$plugin.'");</script>';
    }

    function documentui() {
        $id = $this->request->payload->id;

        $html = $this->localizeHTML("document.html");
        $html = str_replace("{id}", $id, $html);
        $html = str_replace("{src}",
            $this->settings->url . $this->settings->php->path . "storage/tmp/" . $id . ".html", $html);

        return $html;
    }

    function savedoc() {

    }

    function getsrc() {
        $id = $this->request->payload->id;
        $plugin = $this->request->payload->plugin;
        $html = $this->request->payload->html;

        include $this->pluginpath . $plugin . "/php/" . $plugin . ".php";

        $beacon->path = $this->pluginpath . $plugin . "/";
        $beacon->url = $this->settings->url . $this->settings->php->pluginpath . $plugin . "/";
        $beacon->html = urldecode($html);
        $beacon->parser = new BeaconParser();
        $beacon->wrap = false;

        $text = getsrc($beacon);

        return $text;
    }

    function gethtml() {
        $id = $this->request->payload->id;
        $plugin = $this->request->payload->plugin;
        $src = $this->request->payload->src;

        include $this->pluginpath . $plugin . "/php/" . $plugin . ".php";

        $beacon->path = $this->pluginpath . $plugin . "/";
        $beacon->url = $this->settings->url . $this->settings->php->pluginpath . $plugin . "/";
        $beacon->src = urldecode($src);
        $beacon->parser = new BeaconParser();
        $beacon->wrap = false;

        $text = gethtml($beacon);

        return $text;
    }

    function deletedoc() {
        $id = $this->request->payload->id;

        $success = false;

        if ($this->settings->storage === "flatfile") {
             $storage = new BeaconFlatFile($this->phppath . "storage/tmp/");
             $success = $storage->deleteDocument($id);
         }

         if ($success) {
             return $this->tr("File was deleted successfully");
         } else {
             return $this->tr("File could not be deleted");
         }
    }

    function localizeHTML($file) {
        $text = $this->getTemplate($file);

        $array = $this->pages[$file];
        $array_keys = array_keys($array);

        $i = 0;

        for ($i = 0; $i < count($array_keys); $i++) {
            $text = str_replace("{" . $array_keys[$i] . "}", $array[ $array_keys[$i] ], $text);
        }

        return $text;
    }

    function tr($str) {
        if ($this->pages["miscellaneous"][$str]) {
            return $this->pages["miscellaneous"][$str];
        } else {
            return "No Localized String Found";
        }
    }

    function getTemplate($file) {
        return file_get_contents($this->fullPath . $this->settings->php->htmlpath . $file);
    }

    function readSettings($confFile) {
        $this->settings = json_decode(file_get_contents($confFile));
        $this->phppath = $this->fullPath . $this->settings->php->path;
        $this->i18npath = $this->fullPath . $this->settings->php->i18npath;
        $this->pluginpath = $this->fullPath . $this->settings->php->pluginpath;
    }

    function randomstr($length){
        $randstr = "";
        for($i=0; $i<$length; $i++) {
            $randnum = mt_rand(0,61);
            if($randnum < 10) {
                $randstr .= chr($randnum+48);
            } else if($randnum < 36) {
                $randstr .= chr($randnum+55);
            } else {
                $randstr .= chr($randnum+61);
            }
        }
        return $randstr;
    }
};

?>
