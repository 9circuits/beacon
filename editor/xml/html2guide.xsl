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

<xsl:template match="span[@title='guideEm']">
	<e>
		<xsl:apply-templates />
	</e>
</xsl:template>

<xsl:template match="span[@title='guideCodeInput']">
	<c>
		<xsl:apply-templates />
	</c>
</xsl:template>

<xsl:template match="span[@title='guideCodePath']">
	<path>
		<xsl:apply-templates />
	</path>
</xsl:template>




<xsl:template match="p[@title='guideAuthor']">
	<xsl:variable name="title">
		<xsl:value-of select="i[@title='guideAuthorTitle']" />
	</xsl:variable>
	<xsl:text>&#10;</xsl:text><author title="{$title}">
	<xsl:text>  </xsl:text><xsl:apply-templates />
</author>
</xsl:template>


<xsl:template match="a[@title='guideMail']">
	<xsl:variable name="name">
		<xsl:value-of select="." />
	</xsl:variable>
	<xsl:choose>
		<xsl:when test="string-length(@linkval) &gt; 0">
			<xsl:text>  </xsl:text><mail link="{@linkval}"><xsl:apply-templates /></mail>
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

<xsl:template match="b">
	<xsl:apply-templates />
</xsl:template>

<xsl:template match="div[@title='guideVersion']">
	<version><xsl:apply-templates /></version>
</xsl:template>

</xsl:stylesheet>