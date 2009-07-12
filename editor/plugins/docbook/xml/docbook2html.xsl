<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

<xsl:output method="html" encoding="UTF-8" indent="yes"/>

<xsl:strip-space elements="*"/>
<xsl:preserve-space elements="screen"/>

<xsl:template match="/">
    <xsl:apply-templates select="article"/>
</xsl:template>

<xsl:template match="article">
    <div id="{@id}" title="docbookArticle">
        <h1 class="title" title="docbookArticleTitle">
            <xsl:value-of select="title" />
        </h1>
        <xsl:apply-templates select="section"/>
    </div>
</xsl:template>

<xsl:template match="section">
    <xsl:variable name="secdepth">
        <xsl:value-of select="count(ancestor::*)" />
    </xsl:variable>
    <div id="{@id}" title="docbookSection" class="section">
        <xsl:choose>
            <xsl:when test="$secdepth = 1">
                <h2 title="docbookSectionTitle">
                    <xsl:value-of select="title" />
                </h2>
            </xsl:when>

            <xsl:when test="$secdepth = 2">
                <h3 title="docbookSectionTitle">
                    <xsl:value-of select="title" />
                </h3>
            </xsl:when>

            <xsl:when test="$secdepth = 3">
                <h4 title="docbookSectionTitle">
                    <xsl:value-of select="title" />
                </h4>
            </xsl:when>

            <xsl:when test="$secdepth = 4">
                <h5 title="docbookSectionTitle">
                    <xsl:value-of select="title" />
                </h5>
            </xsl:when>

            <!-- Following should never execute. Here as a fail safe. -->
            <xsl:otherwise>
                <h2 title="docbookSectionTitle">
                    <xsl:value-of select="title" />
                </h2>
            </xsl:otherwise>
        </xsl:choose>

        <xsl:apply-templates />
    </div>
</xsl:template>

<!-- Bad hack. Need to remove later. -->
<xsl:template match="title">
</xsl:template>

<xsl:template match="para">
    <p title="docbookPara">
        <xsl:apply-templates />
    </p>
</xsl:template>

<xsl:template match="note">
    <div class="note" title="docbookNote">
        <h2 class="label" title="docbookNoteTitle">
            <xsl:value-of select="title" />
        </h2>
        <xsl:apply-templates />
    </div>
</xsl:template>

<xsl:template match="important">
    <div class="important" title="docbookImportant">
        <h2 class="label" title="docbookImportantTitle">
            <xsl:value-of select="title" />
        </h2>
        <xsl:apply-templates />
    </div>
</xsl:template>

<xsl:template match="warning">
    <div class="warning" title="docbookWarning">
        <h2 class="label" title="docbookWarningTitle">
            <xsl:value-of select="title" />
        </h2>
        <xsl:apply-templates />
    </div>
</xsl:template>

<xsl:template match="itemizedlist">
    <div title="docbookItemizedListContainer">
        <p class="itemizedlistitle" title="docbookItemizedListTitle">
            <xsl:value-of select="title" />
        </p>
        <ul title="docbookItemizedList" class="itemizedlist">
            <xsl:apply-templates />
        </ul>
    </div>
</xsl:template>

<xsl:template match="listitem">
    <li title="docbookListItem">
        <xsl:apply-templates />
    </li>
</xsl:template>

<xsl:template match="procedure">
    <ol title="docbookProcedure" class="procedure">
        <xsl:apply-templates />
    </ol>
</xsl:template>

<xsl:template match="step">
    <li title="docbookStep">
        <xsl:apply-templates />
    </li>
</xsl:template>

<xsl:template match="screen">
    <pre title="docbookScreen" class="screen">
        <xsl:apply-templates />
    </pre>
</xsl:template>



<!-- ********************** -->
<!-- Inline tags below this -->
<!-- ********************** -->

<xsl:template match="sgmltag">
    <span title="docbookSGMLTag" class="sgmltag-{@class}">
        <xsl:apply-templates />
    </span>
</xsl:template>

<xsl:template match="emphasis">
    <span title="docbookEmphasis" class="emphasis">
        <xsl:apply-templates />
    </span>
</xsl:template>

<xsl:template match="filename">
    <code title="docbookFileName" class="filename">
        <xsl:apply-templates />
    </code>
</xsl:template>

<xsl:template match="classname">
    <code title="docbookClassName" class="classname">
        <xsl:apply-templates />
    </code>
</xsl:template>

<xsl:template match="constant">
    <code title="docbookConstant" class="constant">
        <xsl:apply-templates />
    </code>
</xsl:template>

<xsl:template match="function">
    <code title="docbookFunction" class="function">
        <xsl:apply-templates />
    </code>
</xsl:template>

<xsl:template match="parameter">
    <code title="docbookParameter" class="parameter">
        <xsl:apply-templates />
    </code>
</xsl:template>

<xsl:template match="replaceable">
    <code title="docbookReplaceable" class="replaceable">
        <xsl:apply-templates />
    </code>
</xsl:template>

<xsl:template match="varname">
    <code title="docbookVarname" class="varname">
        <xsl:apply-templates />
    </code>
</xsl:template>

<xsl:template match="structfield">
    <code title="docbookStructfield" class="structfield">
        <xsl:apply-templates />
    </code>
</xsl:template>

<xsl:template match="systemitem">
    <code title="docbookSystemItem" class="systemitem">
        <xsl:apply-templates />
    </code>
</xsl:template>

<xsl:template match="package">
    <span title="docbookPackage" class="package">
        <xsl:apply-templates />
    </span>
</xsl:template>

<xsl:template match="command">
    <span title="docbookCommand" class="command">
        <xsl:apply-templates />
    </span>
</xsl:template>

<xsl:template match="option">
    <span title="docbookOption" class="option">
        <xsl:apply-templates />
    </span>
</xsl:template>

<xsl:template match="userinput">
    <code title="docbookUserInput" class="userinput">
        <xsl:apply-templates />
    </code>
</xsl:template>

<xsl:template match="computeroutput">
    <code title="docbookComputerOutput" class="computeroutput">
        <xsl:apply-templates />
    </code>
</xsl:template>

<xsl:template match="prompt">
    <code title="docbookPrompt" class="prompt">
        <xsl:apply-templates />
    </code>
</xsl:template>

<xsl:template match="subscript">
    <sub title="docbookSubscript">
        <xsl:apply-templates />
    </sub>
</xsl:template>

<xsl:template match="superscript">
    <sup title="docbookSuperscript">
        <xsl:apply-templates />
    </sup>
</xsl:template>


<!-- ******************** -->
<!-- Meta tags below this -->
<!-- ******************** -->

<!-- Do nothing for now -->
<xsl:template match="indexterm">
</xsl:template>

</xsl:stylesheet>
