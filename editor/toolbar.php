<div class="toolholder">
    <a class="lbOn" id="save" href="dialogs/savedocument.php?id=<?php echo $_GET['id']; ?>">
        <img src="images/save.png" border="none" />
    </a>    
    <div class="separator"></div>
    <a id="getSource" class="lbOn" href="dialogs/sourceview.php?id=<?php echo $_GET['id']; ?>">
            <img src="images/sourceview.png" border="none" />
    </a>
    <div class="separator"></div>
    <a class="lbOn" href="dialogs/addchapter.php">
        <img src="images/chapter.png" border="none" title="Chapter" />
    </a> 
    <a class="lbOn" href="dialogs/addsection.php">
        <img src="images/section.png" border="none" title="Section" />
    </a>
    <div class="separator"></div>
    <a class="button" id="ol" onClick="execute(this, 'ol');" title="Ordered List">
        <img src="images/ol.png" border="none" />
    </a>
    <a class="button" id="ul" onClick="execute(this, 'ul');" title="Unordered List">
        <img src="images/ul.png" border="none" />
    </a>
     <div class="separator"></div>
    <a class="button" id="code" onClick="execute(this, 'code');" title="Code Listing">
        <img src="images/code.png" border="none" />
    </a>
    <div class="separator"></div>
    <a class="button" name="guideNoteValue" title="Note" id="note" onClick="execute(this, 'note');">
        <img src="images/note.png" border="none" />
    </a>
    <a class="button" name="guideImpoValue" title="Important" id="impo" onClick="execute(this, 'impo');">
        <img src="images/impo.png" border="none" />
    </a>
    <a class="button" name="guideWarnValue" title="Warning" id="warn" onClick="execute(this, 'warn');">
        <img src="images/warn.png" border="none" />
    </a>
    <div class="separator"></div>
    <a class="button" id="paragraph" onClick="execute(this, 'paragraph');" title="Paragraph">
        <img src="images/paragraph.png" border="none" />
    </a>
    <a class="button" id="paragraph" onClick="execute(this, 'epigraph');" title="Paragraph">
        <img src="images/epi.png" border="none" />
    </a>
    <div class="separator"></div>
    <a class="lbOn" href="dialogs/addauthor.php" title="Delete Current Node">
        <img src="images/authors.png" border="none" />
    </a>
    <div class="separator"></div>
    <a class="button" id="delete" onClick="deleteNode();" title="Delete Current Node">
        <img src="images/cancel.png" border="none" />
    </a>
</div>
<div class="toolholder">
    <a class="button" id="bold" onClick="addSpan('guideBold', 'boldtext');" title="Bold">
        <img src="images/bold.png" border="none" />
    </a>
    <a class="button" id="italic" onClick="addSpan('guideEm', 'emphasis');" title="Italic">
        <img src="images/italic.png" border="none" />
    </a>
    <div class="separator"></div>
    <a class="button" id="subscript" onClick="addSpan('guideSub', 'subspan');" title="Subscript">
        <img src="images/sub.png" border="none" />
    </a>    
    <a class="button" id="superscript" onClick="addSpan('guideSup', 'supspan');" title="Superscript">
        <img src="images/sup.png" border="none" />
    </a>
    <div class="separator"></div>
     <a id="addLink" class="lbOn" href="dialogs/addlink.php" title="Link">
            <img src="images/link.png" border="none" />
    </a>
    <a class="button" id="unlink" onClick="removeLink()" title="Unlink">
        <img src="images/unlink.png" border="none" />
    </a>
    <div class="separator"></div>
    <a class="button" onClick="addSpan('guideCodePath', 'path', 'ltr');" title="Add &lt;path&gt;">
        <img src="images/path.png" border="none" />
    </a>
    <a class="button" onClick="addSpan('guideCode', 'code', 'ltr');" title="Highlight as Code">
        <img src="images/code-highlight.png" border="none" />
    </a>
    <a class="button" onClick="addSpan('guideCodeInput', 'code-input');" title="Highlight as Input">
        <img src="images/input.png" border="none" />
    </a>
    <a class="button" onClick="addSpan('guideComment', 'code-comment');" title="Highlight as Comment">
        <img src="images/comment.png" border="none" />
    </a>
    <a class="button" onClick="addSpan('guideIdentifier','code-identifier');" title="Highlight as Identifier">
        <img src="images/ident.png" border="none" />
    </a>
     <a class="button" onClick="addSpan('guideKeyword', 'code-keyword');" title="Highlight as Keyword">
         <img src="images/keyword.png" border="none" />
    </a>
     <a class="button" onClick="addSpan('guideConstant', 'code-constant');" title="Highlight as Constant">
         <img src="images/const.png" border="none" />
    </a>
     <a class="button" onClick="addSpan('guideStatement', 'code-statement');" title="Highlight as Statement">
         <img src="images/stmt.png" border="none" />
    </a>
     <a class="button" onClick="addSpan('guideVariable', 'code-variable');" title="Highlight as Variable">
         <img src="images/variable.png" border="none" />
    </a>
    <div class="separator"></div>
     <a class="button" onClick="clearFormat();" title="Remove All Formatting">
         <img src="images/clear.png" border="none" />
    </a>
</div>