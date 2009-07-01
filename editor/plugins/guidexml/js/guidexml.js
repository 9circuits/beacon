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
            standAlone: true,
            siblings: ["guideParagraph", "guidePre", "guideNote",
                       "guideList", "guideUnorderedList",
                       "guideImportant", "guideWarning",
                       "guideEpigraph"],
            editorType: "richText",
            markup: {
                tag: "p",
                attributes: false
            }
        },

        guideTitle: {
            type: "block",
            inlineChildren: false,
            blockChildren: false,
            standAlone: false,
            siblings: false,
            editorType: "lineedit"
        },

        guideChapterTitle: {
            type: "block",
            inlineChildren: false,
            blockChildren: false,
            standAlone: false,
            siblings: ["guideChapter"],
            editorType: "lineedit"
        },

        guideSectionTitle: {
            type: "block",
            inlineChildren: false,
            blockChildren: false,
            standAlone: false,
            siblings: ["guideSection"],
            editorType: "lineedit"
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
