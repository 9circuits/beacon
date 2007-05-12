<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"> 

<xsl:output method="xml" encoding="UTF-8" indent="yes"/>

<xsl:template match="guide">
    <div id="guide" link="{@link}">
	<div id="sideContent">
	    <div class="date"><hr/><b>Updated</b><br/><div dojoType="inlineEditBox"><xsl:value-of select="date"/></div></div>
	    <div class="abstract"><hr/>	
		<b>Summary</b><br/>
		<p dojoType="inlineEditBox" mode="textarea">
		    <xsl:value-of select="abstract"/>
		</p>
	    </div>
	    <div class="authors">
		<hr/>
		<xsl:for-each select="author">
		    <div class="author">
			<xsl:choose>
			    <xsl:when test="mail">
				<xsl:for-each select="mail">
				    <a class="mail" href="{@link}" dojoType="inlineEditBox"><xsl:value-of select="."/></a><br/>
				</xsl:for-each>
			    </xsl:when>
			    <xsl:otherwise>
				<a class="mail" dojoType="inlineEditBox"><xsl:value-of select="."/></a><br/>
			    </xsl:otherwise>
			</xsl:choose>
			<i dojoType="inlineEditBox"><xsl:value-of select="@title"/></i><br/><br/>
		    </div>
		</xsl:for-each>
		<hr/>
	    </div>
	</div>
	<div id="mainContent">
	    <div class="title">
		<h1 dojoType="inlineEditBox"><xsl:value-of select="title"/></h1>
	    </div>
	    <xsl:for-each select="chapter">
		<div class="chapter">
		    <h2 dojoType="inlineEditBox"><xsl:value-of select="title"/></h2>
		    <xsl:for-each select="section">
			<div class="section">
			    <h3 dojoType="inlineEditBox"><xsl:value-of select="title"/></h3>
			    <xsl:for-each select="body">
				<xsl:for-each select="descendant::*">
				    <xsl:if test="local-name() = 'p'">
					<div class="p" dojoType="inlineEditBox" mode="textarea">
					    <xsl:copy-of select="."/>
					</div>
				    </xsl:if>
				    <xsl:if test="local-name() = 'pre'">
					<div class="code">
					    <div class="codeTitle">
					    <table border="0" width="100%">
						<tr>
						    <td width="10%">Code Listing: </td>
						    <td><div dojoType="inlineEditBox"><xsl:value-of select="@caption"/></div></td>
						</tr>
					    </table>
					    </div>
					    <div dojoType="inlineEditBox" mode="textarea">
						<xsl:copy-of select="."/>
					    </div>
					</div>
				    </xsl:if>
				    <xsl:if test="local-name() = 'note'">
					<div class="note" dojoType="inlineEditBox">
					    <xsl:copy-of select="."/>
					</div>
				    </xsl:if>
				    <xsl:if test="local-name() = 'warn'">
					<div class="warn" dojoType="inlineEditBox">
					    <xsl:copy-of select="."/>
					</div>
				    </xsl:if>
				    <xsl:if test="local-name() = 'impo'">
					<div class="impo" dojoType="inlineEditBox">
					    <xsl:copy-of select="."/>
					</div>
				    </xsl:if>
				</xsl:for-each>
			    </xsl:for-each>
			</div>
		    </xsl:for-each>
		</div>
	    </xsl:for-each>
	</div>
    </div>
</xsl:template>

</xsl:stylesheet>