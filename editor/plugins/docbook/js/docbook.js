/*
* Docbook Plugin for Beacon
*
* Copyright Satya Komaragiri and Beacon Team
* Licensed under GPLv3
*
*/

function docbook_dtd() {

    var dtd = {
        docbookArticle: {
            removable: false
        },

        docbookArticleTitle: {
            type: "block",
            editorType: "lineedit",
            removable: false
        },

        docbookSection: {
            type: "block",
            inlineChildren: false,
            blockChildren: ["docbookSectionTitle"],
            siblings: ["docbookSection"],
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
            editorType: "lineedit",
            markup: {
                tag: "h2",
                attributes: false,
                sampleText: "Sample Section"
            }
        },

        docbookPara: {
            type: "block",
            inlineChildren: ["docbookSGMLTag", "docbookFileName",
                             "docbookCommand", "docbookOption",
                             "docbookUserInput", "docbookComputerOutput"],
            blockChildren: false,
            siblings: ["docbookScreen", "docbookItemizedList",
                       "docbookProcedure", "docbookPara",
                       "docbookNote", "docbookWarning", "docbookImportant"],
            editorType: "richText",
            markup: {
                tag: "p",
                attributes: false,
                sampleText: "This is a sample paragraph."
            }
        },

        docbookItemizedList: {
            type: "block",
            siblings: ["docbookScreen", "docbookItemizedList",
                       "docbookProcedure", "docbookPara",
                       "docbookNote", "docbookWarning", "docbookImportant"],
            markup: {
                requiredChildNodes: ["docbookItemizedListTitle", "docbookItemizedListContainer"],
                tag: "div",
                attributes: false
            }
        },

        docbookItemizedListTitle: {
            type: "block",
            editorType: "lineedit",
            markup: {
                tag: "p",
                attributes: {
                    className: "itemizedlistitle"
                },
                sampleText: "Sample Itemized List"
            }
        },

        docbookItemizedListContainer: {
            type: "block",
            markup: {
                requiredChildNodes: ["docbookListItem"],
                tag: "ul",
                attributes: {
                    className: "itemizedList"
                }
            }
        },

        docbookListItem: {
            type: "block",
            siblings: ["docbookListItem"],
            markup: {
                requiredChildNodes: ["docbookPara"],
                tag: "li",
                attributes: false
            }
        },

        docbookProcedure: {
            type: "block",
            siblings: ["docbookScreen", "docbookItemizedList",
                       "docbookProcedure", "docbookPara",
                       "docbookNote", "docbookWarning", "docbookImportant"],
            markup: {
                requiredChildNodes: ["docbookProcedureTitle", "docbookProcedureContainer"],
                tag: "div",
                attributes: false
            }
        },

        docbookProcedureTitle: {
            type: "block",
            editorType: "lineedit",
            markup: {
                tag: "p",
                attributes: {
                    className: "procedurelistitle"
                },
                sampleText: "Sample Procedure"
            }
        },

        docbookProcedureContainer: {
            type: "block",
            markup: {
                requiredChildNodes: ["docbookListItem"],
                tag: "ol",
                attributes: {
                    className: "procedure"
                }
            }
        },

        docbookStep: {
            type: "block",
            siblings: ["docbookStep"],
            markup: {
                requiredChildNodes: ["docbookPara"],
                tag: "li",
                attributes: false
            }
        },

        docbookNote: {
            type: "block",
            inlineChildren: false,
            blockChildren: false,
            siblings: ["docbookScreen", "docbookItemizedList",
                       "docbookProcedure", "docbookPara",
                       "docbookNote", "docbookWarning", "docbookImportant"],
            markup: {
                requiredChildNodes: ["docbookNoteTitle", "docbookPara"],
                tag: "div",
                attributes: {
                    className: "note"
                },
            }
        },

        docbookNoteTitle: {
            editorType: "lineedit",
            markup: {
                tag: "h2",
                attributes: {
                    className: "label"
                },
                sampleText: "Sample Note"
            }
        },

        docbookWarning: {
            type: "block",
            inlineChildren: false,
            blockChildren: false,
            siblings: ["docbookScreen", "docbookItemizedList",
                       "docbookProcedure", "docbookPara",
                       "docbookNote", "docbookWarning", "docbookImportant"],
            markup: {
                requiredChildNodes: ["docbookWarningTitle", "docbookPara"],
                tag: "div",
                attributes: {
                    className: "warning"
                },
            }
        },

        docbookWarningTitle: {
            editorType: "lineedit",
            markup: {
                tag: "h2",
                attributes: {
                    className: "label"
                },
                sampleText: "Sample Warning"
            }
        },

        docbookImportant: {
            type: "block",
            inlineChildren: false,
            blockChildren: false,
            siblings: ["docbookScreen", "docbookItemizedList",
                       "docbookProcedure", "docbookPara",
                       "docbookNote", "docbookWarning", "docbookImportant"],
            markup: {
                requiredChildNodes: ["docbookImportantTitle", "docbookPara"],
                tag: "div",
                attributes: {
                    className: "warning"
                },
            }
        },

        docbookImportantTitle: {
            editorType: "lineedit",
            markup: {
                tag: "h2",
                attributes: {
                    className: "label"
                },
                sampleText: "Sample Important"
            }
        },

        docbookScreen: {
            type: "block",
            inlineChildren: ["docbookSGMLTag", "docbookFileName",
                             "docbookCommand", "docbookOption",
                             "docbookUserInput", "docbookComputerOutput"],
            blockChildren: false,
            siblings: ["docbookScreen", "docbookItemizedList",
                       "docbookProcedure", "docbookPara",
                       "docbookNote", "docbookWarning", "docbookImportant"],
            editorType: "richText",
            markup: {
                tag: "pre",
                attributes: {
                    className: "screen"
                },
                sampleText: "This is a sample screen."
            }
        },


        // Inline Tags below this

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

        docbookEmphasis: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "span",
                attributes: {
                    className: "emphasis"
                }
            }
        },

        docbookFileName: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "code",
                attributes: {
                    className: "filename"
                }
            }
        },

        docbookClassName: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "code",
                attributes: {
                    className: "classname"
                }
            }
        },

        docbookConstant: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "code",
                attributes: {
                    className: "constant"
                }
            }
        },

        docbookFunction: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "code",
                attributes: {
                    className: "function"
                }
            }
        },

        docbookParameter: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "code",
                attributes: {
                    className: "parameter"
                }
            }
        },

        docbookReplaceable: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "code",
                attributes: {
                    className: "replaceable"
                }
            }
        },

        docbookVarname: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "code",
                attributes: {
                    className: "varname"
                }
            }
        },

        docbookStructfield: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "code",
                attributes: {
                    className: "structfield"
                }
            }
        },

        docbookSystemItem: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "code",
                attributes: {
                    className: "systemitem"
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

        docbookPackage: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "span",
                attributes: {
                    className: "package"
                }
            }
        },

        docbookSubscript: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "sub",
                attributes: false
            }
        },

        docbookSuperscript: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "sup",
                attributes: false
            }
        },

        docbookPrompt: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "code",
                attributes: {
                    className: "prompt"
                }
            }
        },

    };

    return dtd;
};