<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"> 

<xsl:output method="xml" encoding="UTF-8" indent="yes"/>

<xsl:template match="/">
	<guide>
		<xsl:apply-templates />
		<xsl:text>&#10;&#10;</xsl:text>
	</guide>
</xsl:template>

<xsl:template match="body">
    <xsl:apply-templates select="div[@id='guide']"/>
</xsl:template>

<xsl:template match="div[@id='guide']">
	<xsl:text>&#10;</xsl:text><title><xsl:value-of select="div[@id='mainContent']/h1" /></title>
	<xsl:apply-templates />
</xsl:template>

<xsl:template match="div[@id='sideContent']">
	<xsl:text>&#10;</xsl:text><xsl:apply-templates select="p[@title='guideAuthor']"/>
	<xsl:text>&#10;&#10;</xsl:text><xsl:apply-templates select="p[@title='guideAbstract']"/>
	<xsl:text>&#10;&#10;</xsl:text><xsl:apply-templates select="p[@title='guideDate']"/>
	<xsl:text>&#10;</xsl:text><xsl:apply-templates select="div[@title='guideVersion']"/>
</xsl:template>

<xsl:template match="div[@id='mainContent']">
		<xsl:for-each select="child::*">
			<xsl:if test="@title='guideChapter'">
				<xsl:text>&#10;&#10;</xsl:text><chapter><xsl:text>&#10;</xsl:text>
				<xsl:for-each select="child::*">
					<xsl:if test="@title='guideSection'">
						<xsl:text>&#10;</xsl:text><section><xsl:text>&#10;</xsl:text>
						<xsl:for-each select="child::*">
							<xsl:if test="@title='guideBody'">
								<xsl:text>&#10;</xsl:text><body><xsl:text>&#10;</xsl:text>
								    <xsl:apply-templates />
								<xsl:text>&#10;</xsl:text></body>
							</xsl:if>
							<xsl:if test="@title='guideSectionTitle'">
								<title><xsl:apply-templates /></title>
							</xsl:if>
						</xsl:for-each>
						<xsl:text>&#10;</xsl:text></section><xsl:text>&#10;</xsl:text>
					</xsl:if>
					<xsl:if test="@title='guideChapterTitle'">
						<title><xsl:apply-templates /></title>
					</xsl:if>
					
				</xsl:for-each>
				<xsl:text>&#10;</xsl:text></chapter>
			</xsl:if>
		</xsl:for-each>
</xsl:template>

<xsl:template match="p[@title='guideAuthor']">
	<xsl:variable name="title">
		<xsl:value-of select="i[@title='guideAuthorTitle']" />
	</xsl:variable>
	<author title="{$title}">
	    <!--<xsl:text></xsl:text><xsl:apply-templates /> -->
	        <xsl:apply-templates select="span[@title='guideAuthorName']" />
    </author><xsl:text>&#10;</xsl:text>
</xsl:template>

<xsl:template match="span[@title='guideAuthorName']">
    <xsl:apply-templates />
</xsl:template>

<xsl:template match="i[@title='guideAuthorTitle']">
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
			<xsl:text> </xsl:text><mail link="{@linkval}"><xsl:apply-templates /></mail>
		</xsl:when>
		<xsl:otherwise>
			<xsl:text>  </xsl:text><mail link="{$name}" />
		</xsl:otherwise>
	</xsl:choose>
</xsl:template>

<xsl:template match="p[@title='guideDate']">
	<date><xsl:value-of select="span[@title='guideDateValue']" /></date>
</xsl:template>

<xsl:template match="p[@title='guideAbstract']">
	<abstract><xsl:apply-templates select="span[@title='guideAbstractValue']"/></abstract>
</xsl:template>

<xsl:template match="span[@title='guideAbstractValue']">
	<xsl:apply-templates />
</xsl:template>

<xsl:template match="div[@title='guideVersion']">
	<version><xsl:apply-templates /></version>
</xsl:template>


<xsl:template match="div[@title='guideBlock']">
	<xsl:apply-templates />
</xsl:template>

<xsl:template match="ul[@title='guideList']">
    <ul><xsl:text>&#10;</xsl:text>
	    <xsl:apply-templates />
	</ul><xsl:text>&#10;</xsl:text>
</xsl:template>

<xsl:template match="ol[@title='guideList']">
    <ol><xsl:text>&#10;</xsl:text>
	    <xsl:apply-templates />
	</ol><xsl:text>&#10;</xsl:text>
</xsl:template>

<xsl:template match="li">
	<li>
		<xsl:apply-templates />
	</li><xsl:text>&#10;</xsl:text>
</xsl:template>

<xsl:template match="div[@title='guidePreCode']">
    <xsl:variable name="caption">
		<xsl:value-of select="preceding-sibling::div[@title='guidePreHeader']/span[@title='guidePreTitle']" />
	</xsl:variable>
	<pre caption="{$caption}"><xsl:text>&#10;</xsl:text>
	    <xsl:for-each select="pre[@title='guideCodeBox']">
	        <xsl:text>&#10;</xsl:text><xsl:apply-templates />
	    </xsl:for-each>
	</pre>
</xsl:template>

<xsl:template match="p[@class='ncontent']">
	<xsl:apply-templates />
</xsl:template>

<xsl:template match="span[@title='guideWarning']">
    <note>
        <xsl:apply-templates select="span[@title='guideWarnValue']"/>
    </note><xsl:text>&#10;</xsl:text>
</xsl:template>

<xsl:template match="span[@title='guideWarnValue']">
		<xsl:apply-templates />
</xsl:template>

<xsl:template match="span[@title='guideNote']">
    <warn>
        <xsl:apply-templates select="span[@title='guideNoteValue']"/>
    </warn><xsl:text>&#10;</xsl:text>
</xsl:template>

<xsl:template match="span[@title='guideNoteValue']">
		<xsl:apply-templates />
</xsl:template>

<xsl:template match="span[@title='guideImportant']">
    <impo>
        <xsl:apply-templates select="span[@title='guideImpoValue']"/>
    </impo><xsl:text>&#10;</xsl:text>
</xsl:template>

<xsl:template match="span[@title='guideImpoValue']">
		<xsl:apply-templates />
</xsl:template>
   
<xsl:template match="p[@title='guideParagraph']">
	<p><xsl:apply-templates /></p><xsl:text>&#10;</xsl:text>
</xsl:template>

<xsl:template match="p[@title='guideEpigraph']">
    <xsl:variable name="by">
		<xsl:value-of select="span[@title='guideSignature']" />
	</xsl:variable>
	<p by="{$by}"><xsl:apply-templates /></p><xsl:text>&#10;</xsl:text>
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
	<table><xsl:text>&#10;</xsl:text>
		<xsl:apply-templates />
	</table><xsl:text>&#10;</xsl:text>
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

<xsl:template match="ti">
	<td colspan="{@colspan}" rowspan="{@rowspan}" align="{@align}" class="tableinfo" >
		<xsl:apply-templates />
	</td>
</xsl:template>

<xsl:template match="dl">
	<dl><xsl:text>&#10;</xsl:text>
		<xsl:apply-templates />
	</dl><xsl:text>&#10;</xsl:text>
</xsl:template>

<xsl:template match="dt">
	<dt><xsl:text>&#10;</xsl:text>
		<xsl:apply-templates />
	</dt><xsl:text>&#10;</xsl:text>
</xsl:template>

<xsl:template match="dd">
	<dd><xsl:text>&#10;</xsl:text>
		<xsl:apply-templates />
	</dd><xsl:text>&#10;</xsl:text>
</xsl:template>

<xsl:template match="b">
	<xsl:apply-templates />
</xsl:template>

<xsl:template match="div[@title='guidePreHeader']">
</xsl:template>


</xsl:stylesheet>