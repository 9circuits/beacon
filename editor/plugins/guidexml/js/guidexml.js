/*
 * GuideXML Plugin for Beacon
 * 
 * Copyright Beacon Dev Team
 * Licensed under GPLv3
 *
 * This plugin also serves as a guideline on how to
 * create a plugin for Beacon.
 *
 */
 
/*
 * This is the default init function that Beacon
 * will use. Specify this in your resources.txt
 *
 * Arguments:
 * container - The display on which your document resides.
 * action - Type of action. Like "new", "edit", etc.
 *
 * Return Type:
 * A new instance of the Document Object
 *
 */
function guidexml(container, action) {
    $(container).append("I am the default guidexml plugin.")
    // THIS IS WAY INCOMPLETE!!!
    //return new GuideXML();
}

/*
 * This is the document object for the plugin.
 * 
 */
function GuideXML(opts) {



}

