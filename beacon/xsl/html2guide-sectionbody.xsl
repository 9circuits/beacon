<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"> 

<xsl:output method="xml" encoding="UTF-8" indent="yes" omit-xml-declaration="yes" />

<xsl:template match="/">
		<xsl:apply-templates select="div[title='guideBody']"/>
</xsl:template>

<xsl:template match="div[title='guideBody']">
		<xsl:apply-templates />
</xsl:template>

<xsl:template match="b[@title='guideMailValue']">
    <xsl:apply-templates />
</xsl:template>

<xsl:template match="a[@title='guideMail']">
	<xsl:variable name="name">
		<xsl:value-of select="." />
	</xsl:variable>
	<xsl:choose>
		<xsl:when test="string-length(@linkval) &gt; 0">
			<mail link="{@linkval}"><xsl:apply-templates /></mail>
		</xsl:when>
		<xsl:otherwise>
			<mail link="{$name}" />
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template match="a[@title='guideLink']">
    	<xsl:choose>
    		<xsl:when test="string-length(@linkval) &gt; 0">
    			<uri link="{@linkval}">
    				<xsl:apply-templates />
    			</uri>
    		</xsl:when>
    		<xsl:otherwise>
    			<uri>
    				<xsl:apply-templates />
    			</uri>
    		</xsl:otherwise>
    	</xsl:choose>
</xsl:template>

<xsl:template match="div[@title='guideBlock']">
	<xsl:apply-templates />
</xsl:template>

<xsl:template match="ul[@title='guideList']">
    <ul>
	    <xsl:apply-templates />
	</ul>
</xsl:template>

<xsl:template match="ol[@title='guideList']">
    <ol>
	    <xsl:apply-templates />
	</ol>
</xsl:template>

<xsl:template match="li">
	<li>
		<xsl:apply-templates />
	</li>
</xsl:template>

<xsl:template match="div[@title='guidePreCode']">
    <xsl:variable name="caption">
		<xsl:value-of select="preceding-sibling::div[@title='guidePreHeader']/span[@title='guidePreTitle']" />
	</xsl:variable>
	<pre caption="{$caption}">
	    <xsl:for-each select="pre[@title='guideCodeBox']">
	        <xsl:apply-templates />
	    </xsl:for-each>
	</pre>
</xsl:template>

<xsl:template match="br">
    <xsl:text>&#10;</xsl:text>
</xsl:template>

<xsl:template match="p[@class='ncontent']">
	<xsl:apply-templates />
</xsl:template>

<xsl:template match="span[@title='guideWarning']">
    <warn>
        <xsl:apply-templates select="span[@title='guideWarnValue']"/>
    </warn>
</xsl:template>

<xsl:template match="span[@title='guideWarnValue']">
		<xsl:apply-templates />
</xsl:template>

<xsl:template match="span[@title='guideNote']">
    <note>
        <xsl:apply-templates select="span[@title='guideNoteValue']"/>
    </note>
</xsl:template>

<xsl:template match="span[@title='guideNoteValue']">
		<xsl:apply-templates />
</xsl:template>

<xsl:template match="span[@title='guideImportant']">
    <impo>
        <xsl:apply-templates select="span[@title='guideImpoValue']"/>
    </impo>
</xsl:template>

<xsl:template match="span[@title='guideImpoValue']">
		<xsl:apply-templates />
</xsl:template>
   
<xsl:template match="p[@title='guideParagraph']">
	<p><xsl:apply-templates /></p>
</xsl:template>

<xsl:template match="p[@title='guideEpigraph']">
    <xsl:variable name="by">
		<xsl:value-of select="span[@title='guideSignature']" />
	</xsl:variable>
	<p by="{$by}"><xsl:apply-templates /></p>
</xsl:template>

<xsl:template match="span[@title='guideComment']">
	<comment>
		<xsl:apply-templates />
	</comment>
</xsl:template>

<xsl:template match="span[@title='guideSub']">
	<sub>
		<xsl:apply-templates />
	</sub>
</xsl:template>

<xsl:template match="span[@title='guideSup']">
	<sup>
		<xsl:apply-templates />
	</sup>
</xsl:template>

<xsl:template match="span[@title='guideStatement']">
	<stmt>
		<xsl:apply-templates />
	</stmt>
</xsl:template>

<xsl:template match="span[@title='guideKeyword']">
	<keyword>
		<xsl:apply-templates />
	</keyword>
</xsl:template>

<xsl:template match="span[@title='guideIdentifier']">
	<ident>
		<xsl:apply-templates />
	</ident>
</xsl:template>

<xsl:template match="span[@title='guideConstant']">
	<const>
		<xsl:apply-templates />
	</const>
</xsl:template>

<xsl:template match="span[@title='guideVariable']">
	<var>
		<xsl:apply-templates />
	</var>
</xsl:template>

<xsl:template match="span[@title='guideEm']">
	<e>
		<xsl:apply-templates />
	</e>
</xsl:template>

<xsl:template match="span[@title='guideBold']">
    <b>
	    <xsl:apply-templates />
	</b>
</xsl:template>


<xsl:template match="span[@title='guideCodeInput']">
	<i>
		<xsl:apply-templates />
	</i>
</xsl:template>

<xsl:template match="span[@title='guideCode']">
	<c>
		<xsl:apply-templates />
	</c>
</xsl:template>

<xsl:template match="span[@title='guideCodePath']">
	<path>
		<xsl:apply-templates />
	</path>
</xsl:template>

<xsl:template match="table">
	<table>
		<xsl:apply-templates />
	</table>
</xsl:template>

<xsl:template match="tr">
	<tr>
		<xsl:apply-templates />
	</tr>
</xsl:template>

<xsl:template match="th">
	<th colspan="{@colspan}" rowspan="{@rowspan}" align="{@align}" class="infohead" >
		<xsl:apply-templates />
	</th>
</xsl:template>

<xsl:template match="td">
	<ti colspan="{@colspan}" rowspan="{@rowspan}" align="{@align}" class="tableinfo" >
		<xsl:apply-templates />
	</ti>
</xsl:template>

<xsl:template match="dl">
	<dl>
		<xsl:apply-templates />
	</dl>
</xsl:template>

<xsl:template match="dt">
	<dt>
		<xsl:apply-templates />
	</dt>
</xsl:template>

<xsl:template match="dd">
	<dd>
		<xsl:apply-templates />
	</dd>
</xsl:template>

<xsl:template match="b">
	<xsl:apply-templates />
</xsl:template>

<xsl:template match="div[@title='guidePreHeader']">
</xsl:template>


</xsl:stylesheet>
