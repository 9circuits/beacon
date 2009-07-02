<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">

<xsl:output method="xml" encoding="UTF-8" indent="yes" />

<xsl:strip-space elements="*"/>
<xsl:preserve-space elements="pre"/>

<xsl:template match="/">
    <xsl:apply-templates />
</xsl:template>

<xsl:template match="div[@title='docbookArticle']">
    <article id="{@id}">
        <xsl:apply-templates />
    </article>
</xsl:template>

<xsl:template match="div[@title='docbookSection']">
    <section id="{@id}">
        <xsl:apply-templates />
    </section>
</xsl:template>

<xsl:template match="h2[@title='docbookSectionTitle']">
    <title>
        <xsl:apply-templates />
    </title>
</xsl:template>

<xsl:template match="h3[@title='docbookSectionTitle']">
    <title>
        <xsl:apply-templates />
    </title>
</xsl:template>

<xsl:template match="h4[@title='docbookSectionTitle']">
    <title>
        <xsl:apply-templates />
    </title>
</xsl:template>

<xsl:template match="h5[@title='docbookSectionTitle']">
    <title>
        <xsl:apply-templates />
    </title>
</xsl:template>

<xsl:template match="p[@title='docbookPara']">
    <para>
        <xsl:apply-templates />
    </para>
</xsl:template>

<xsl:template match="ul[@title='docbookItemizedList']">
    <itemizedlist>
        <xsl:apply-templates />
    </itemizedlist>
</xsl:template>

<xsl:template match="li[@title='docbookListItem']">
    <listitem>
        <xsl:apply-templates />
    </listitem>
</xsl:template>

<xsl:template match="ol[@title='docbookProcedure']">
    <procedure>
        <xsl:apply-templates />
    </procedure>
</xsl:template>

<xsl:template match="li[@title='docbookStep']">
    <step>
        <xsl:apply-templates />
    </step>
</xsl:template>

<xsl:template match="pre[@title='docbookScreen']">
<screen>
<xsl:apply-templates />
</screen>
</xsl:template>



<xsl:template match="span[@title='docbookSGMLTag']">
    <xsl:variable name="classname" select="substring(@class, 9)" />
    <sgmltag class="{$classname}">
        <xsl:apply-templates />
    </sgmltag>
</xsl:template>

<xsl:template match="span[@title='docbookFileName']">
    <filename>
        <xsl:apply-templates />
    </filename>
</xsl:template>

<xsl:template match="span[@title='docbookCommand']">
    <command>
        <xsl:apply-templates />
    </command>
</xsl:template>

<xsl:template match="span[@title='docbookOption']">
    <option>
        <xsl:apply-templates />
    </option>
</xsl:template>

<xsl:template match="span[@title='docbookUserInput']">
    <userinput>
        <xsl:apply-templates />
    </userinput>
</xsl:template>

<xsl:template match="span[@title='docbookComputerOutput']">
    <computeroutput>
        <xsl:value-of select="." />
    </computeroutput>
</xsl:template>

</xsl:stylesheet>