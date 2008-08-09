<div class="toolholder">
    <a class="button" id="bold" onClick="BeaconEditor.addSpan('guideBold', 'boldtext');" title="Bold">
        <img src="images/bold.png" border="none" />
    </a>
    <a class="button" id="italic" onClick="BeaconEditor.addSpan('guideEm', 'emphasis');" title="Italic">
        <img src="images/italic.png" border="none" />
    </a>
    <div class="separator"></div>
    <a class="button" id="subscript" onClick="BeaconEditor.addSpan('guideSub', 'subspan');" title="Subscript">
        <img src="images/sub.png" border="none" />
    </a>    
    <a class="button" id="superscript" onClick="BeaconEditor.addSpan('guideSup', 'supspan');" title="Superscript">
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
    <a class="button" onClick="BeaconEditor.addSpan('guideCodePath', 'path', 'ltr');" title="Add &lt;path&gt;">
        <img src="images/path.png" border="none" />
    </a>
    <a class="button" onClick="BeaconEditor.addSpan('guideCode', 'code', 'ltr');" title="Highlight as Code">
        <img src="images/code-highlight.png" border="none" />
    </a>
    <a class="button" onClick="BeaconEditor.addSpan('guideCodeInput', 'code-input');" title="Highlight as Input">
        <img src="images/input.png" border="none" />
    </a>
    <a class="button" onClick="BeaconEditor.addSpan('guideComment', 'code-comment');" title="Highlight as Comment">
        <img src="images/comment.png" border="none" />
    </a>
    <a class="button" onClick="BeaconEditor.addSpan('guideIdentifier','code-identifier');" title="Highlight as Identifier">
        <img src="images/ident.png" border="none" />
    </a>
    <a class="button" onClick="BeaconEditor.addSpan('guideKeyword', 'code-keyword');" title="Highlight as Keyword">
         <img src="images/keyword.png" border="none" />
    </a>
    <a class="button" onClick="BeaconEditor.addSpan('guideConstant', 'code-constant');" title="Highlight as Constant">
         <img src="images/const.png" border="none" />
    </a>
    <a class="button" onClick="BeaconEditor.addSpan('guideStatement', 'code-statement');" title="Highlight as Statement">
         <img src="images/stmt.png" border="none" />
    </a>
    <a class="button" onClick="BeaconEditor.addSpan('guideVariable', 'code-variable');" title="Highlight as Variable">
         <img src="images/variable.png" border="none" />
    </a>
    <div class="separator"></div>
    <a class="button" onClick="BeaconEditor.clearFormat();" title="Remove All Formatting">
         <img src="images/clear.png" border="none" />
    </a>
</div>