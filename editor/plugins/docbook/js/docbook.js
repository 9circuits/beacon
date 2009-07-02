/*
* Docbook Plugin for Beacon
*
* Copyright Satya Komaragiri and Beacon Team
* Licensed under GPLv3
*
*/

function docbook_dtd() {

   var dtd = {
       docbookPara: {
           type: "block",
           inlineChildren: ["docbookSGMLTag", "docbookFileName",
                            "docbookCommand", "docbookOption",
                            "docbookUserInput", "docbookComputerOutput"],
           blockChildren: false,
           siblings: ["docbookScreen", "docbookItemizedList",
                      "docbookProcedure", "docbookPara"],
           editorType: "richText",
           standAlone: true,
           markup: {
               tag: "p",
               attributes: false,
               sampleText: "This is a sample paragraph."
           }
       },

       docbookSection: {
           type: "block",
           inlineChildren: false,
           blockChildren: ["docbookSectionTitle"],
           siblings: ["docbookSection"],
           standAlone: true,
           markup: {
               requiredChildNodes: ["docbookSectionTitle", "docbookPara"],
               tag: "div",
               attributes: {
                   className: "section"
               }
           }
       },

       docbookSectionTitle: {
           type: "block",
           inlineChildren: false,
           blockChildren: false,
           standAlone: false,
           siblings: ["docbookSection"],
           editorType: "lineedit",
           markup: {
               tag: "h2",
               attributes: false,
               sampleText: "Sample Section"
           }
       },

       docbookSGMLTag: {
           type: "inline",
           inlineType: "generic",
           markup: {
               tag: "span",
               attributes: {
                   className: "sgmltag-element"
               }
           }
       },

       docbookFileName: {
           type: "inline",
           inlineType: "generic",
           markup: {
               tag: "span",
               attributes: {
                   className: "filename"
               }
           }
       },

       docbookCommand: {
           type: "inline",
           inlineType: "generic",
           markup: {
               tag: "span",
               attributes: {
                   className: "command",
               }
           }
       },

       docbookOption: {
           type: "inline",
           inlineType: "generic",
           markup: {
               tag: "span",
               attributes: {
                   className: "option"
               }
           }
       },

       docbookUserInput: {
           type: "inline",
           inlineType: "generic",
           markup: {
               tag: "span",
               attributes: {
                   className: "userinput",
               }
           }
       },

       docbookComputerOutput: {
           type: "inline",
           inlineType: "generic",
           markup: {
               tag: "span",
               attributes: {
                   className: "computeroutput"
               }
           }
       },


   };

   return dtd;
};