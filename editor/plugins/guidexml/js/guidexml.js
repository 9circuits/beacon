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

function guidexml_dtd() {
    var dtd = {
        guideParagraph: {
            type: "block",
            inlineChildren: ["guideCode", "guideEm", "guideBold", "guideLink",
                             "guideIdentifier", "guideKeyWord",
                             "guideConstant", "guideStatement",
                             "guideVariable", "guideSub", "guideSup",
                             "guideCodeInput", "guideCodePath"],
            blockChildren: false,
            siblings: ["guideParagraph", "guidePre", "guideNote",
                       "guideList", "guideUnorderedList",
                       "guideImportant", "guideWarning",
                       "guideEpigraph"],
            editorType: "richText",
            standAlone: true,
            markup: {
                tag: "p",
                attributes: false,
                sampleText: "This is a sample paragraph."
            }
        },

        guideTitle: {
            type: "block",
            inlineChildren: false,
            blockChildren: false,
            standAlone: true,
            siblings: false,
            editorType: "lineedit",
            deletable: false
        },

        guideChapter: {
            type: "block",
            inlineChildren: false,
            blockChildren: ["guideChapterTitle", "guideSection"],
            siblings: ["guideChapter"],
            standAlone: true,
            markup: {
                requiredChildNodes: ["guideChapterTitle", "guideSection"],
                tag: "div",
                attributes: false
            }
        },

        guideChapterTitle: {
            type: "block",
            inlineChildren: false,
            blockChildren: false,
            standAlone: false,
            siblings: ["guideChapter"],
            editorType: "lineedit",
            markup: {
                tag: "p",
                attributes: {
                    className: "chaphead"
                },
                sampleText: "Sample Chapter"
            }
        },

        guideSection: {
            type: "block",
            inlineChildren: false,
            blockChildren: ["guideSectionTitle"],
            siblings: ["guideSection"],
            standAlone: true,
            markup: {
                requiredChildNodes: ["guideSectionTitle", "guideBody"],
                tag: "div",
                attributes: false
            }
        },

        guideSectionTitle: {
            type: "block",
            inlineChildren: false,
            blockChildren: false,
            standAlone: false,
            siblings: ["guideSection"],
            editorType: "lineedit",
            markup: {
                tag: "p",
                attributes: {
                    className: "secthead"
                },
                sampleText: "Sample Section"
            }
        },

        guideBody: {
            type: "block",
            inlineChildren: false,
            blockChildren: ["guideParagraph", "guidePre", "guideEpigraph",
                            "guideNote", "guideList", "guideUnorderedList",
                            "guideImportant", "guideWarning"],
            siblings: false,
            standAlone: false,
            markup: {
                requiredChildNodes: ["guideParagraph"],
                tag: "div",
                attributes: false
            }
        },

        guideAbstractValue: {
            type: "block",
            inlineChildren: false,
            blockChildren: false,
            standAlone: false,
            siblings: false,
            editorType: "plaintext"
        },

        guideBold: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "span",
                attributes: {
                    className: "boldtext"
                }
            }
        },

        guideEm: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "span",
                attributes: {
                    className: "emphasis"
                }
            }
        },

        guideCode: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "span",
                attributes: {
                    className: "code",
                    dir: "ltr"
                }
            }
        },

        guideCodeInput: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "span",
                attributes: {
                    className: "code-input"
                }
            }
        },

        guideCodePath: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "span",
                attributes: {
                    className: "path",
                    dir: "ltr"
                }
            }
        },

        guideSub: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "span",
                attributes: {
                    className: "subspan"
                }
            }
        },

        guideSup: {
            type: "inline",
            inlineType: "generic",
            markup: {
                tag: "span",
                attributes: {
                    className: "supspan"
                }
            }
        },
    };

    return dtd;
};
