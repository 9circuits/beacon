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


};

?>
