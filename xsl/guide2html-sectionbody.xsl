<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"> 

	<xsl:output method="html" encoding="UTF-8" indent="yes" omit-xml-declaration="yes" />

	<xsl:template match="/">
			<xsl:apply-templates select="body" />
	</xsl:template>

	<xsl:template match="body">
			<xsl:apply-templates />
	</xsl:template>
	
	<xsl:template match="p">
	    <div title="guideBlock">
    		<xsl:choose>
    			<xsl:when test="string-length(@by) &gt; 0">
    				<p title="guideEpigraph" class="epigraph"><xsl:apply-templates />
    				<br /><br />- <span title="guideSignature" class="episig"><xsl:value-of select="@by" /></span><br /><br /></p>
    			</xsl:when>
    			<xsl:otherwise>
    				<p title="guideParagraph">
    					<xsl:apply-templates />
    				</p>
    			</xsl:otherwise>
    		</xsl:choose>
        </div>
	</xsl:template>
	
	<xsl:template match="uri">
		<xsl:choose>
			<xsl:when test="string-length(@link) &gt; 0">
				<a title="guideLink" href="{@link}" linkval="{@link}">
					<xsl:apply-templates />
				</a>
			</xsl:when>
			<xsl:otherwise>
				<a title="guideLink" href="{text()}">
					<xsl:apply-templates />
				</a>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="pre">
		<div title="guideBlock">
			<div title="guidePreHeader" class="codetitle" style="background: #7a5ada; margin: 0px;">
				Code Listing: <span title="guidePreTitle"><xsl:value-of select="@caption"/></span>
			</div>
			<div title="guidePreCode" style="background: #eeeeff;">
				<pre title="guideCodeBox"><xsl:apply-templates /></pre>
			</div>
		</div>
	</xsl:template>
	
	<xsl:template match="i">
		<span title="guideCodeInput" class="code-input">
			<xsl:apply-templates />
		</span>
	</xsl:template>
	
	<xsl:template match="path">
		<span title="guideCodePath" class="path" dir="ltr">
			<xsl:apply-templates />
		</span>
	</xsl:template>
	
	<xsl:template match="note">
		<div title="guideBlock">
    		<p class="ncontent" style="background:#bbffbb;">
    			<span title="guideNote" class="note">
    				<b>Note: </b>
    				<span title="guideNoteValue"><xsl:apply-templates /></span>
    			</span>
    		</p>
		</div>
	</xsl:template>
	
	<xsl:template match="warn">
		<div title="guideBlock">
    		<p class="ncontent" style="background:#ffbbbb;">
    			<span title="guideWarning" class="warn">
    				<b>Warning: </b>
    				<span title="guideWarnValue"><xsl:apply-templates /></span>
    			</span>
    		</p>
		</div>
	</xsl:template>
	
	<xsl:template match="impo">
		<div title="guideBlock">
    		<p class="ncontent" style="background:#ffffbb;">
    			<span title="guideImportant" class="impo">
    				<b>Important: </b>
    				<span title="guideImpoValue"><xsl:apply-templates /></span>
    			</span>
    		</p>
		</div>
	</xsl:template>
	
	<xsl:template match="comment">
		<span title="guideComment" class="code-comment">
			<xsl:apply-templates />
		</span>
	</xsl:template>
	
	<xsl:template match="c">
		<span title="guideCode" class="code" dir="ltr">
			<xsl:apply-templates />
		</span>
	</xsl:template>
	
	<xsl:template match="e">
		<span title="guideEm" class="emphasis">
			<xsl:apply-templates />
		</span>
	</xsl:template>
	
	<xsl:template match="keyword">
		<span title="guideKeyword" class="code-keyword">
			<xsl:apply-templates />
		</span>
	</xsl:template>
	
	<xsl:template match="ident">
		<span title="guideIdentifier" class="code-identifier">
			<xsl:apply-templates />
		</span>
	</xsl:template>
	
	<xsl:template match="const">
		<span title="guideConstant" class="code-constant">
			<xsl:apply-templates />
		</span>
	</xsl:template>
	
	<xsl:template match="stmt">
		<span title="guideStatement" class="code-statement">
			<xsl:apply-templates />
		</span>
	</xsl:template>
	
	<xsl:template match="var">
		<span title="guideVariable" class="code-variable">
			<xsl:apply-templates />
		</span>
	</xsl:template>
	
	<xsl:template match="sub">
		<span title="guideSub" class="subspan">
			<xsl:apply-templates />
		</span>
	</xsl:template>
	
	<xsl:template match="sup">
		<span title="guideSup" class="supspan">
			<xsl:apply-templates />
		</span>
	</xsl:template>
	
	<xsl:template match="b">
		<span title="guideBold" class="boldtext">
			<xsl:apply-templates />
		</span>
	</xsl:template>
	
	<xsl:template match="table">
		<table class="ntable">
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
	
	<xsl:template match="ti">
		<td colspan="{@colspan}" rowspan="{@rowspan}" align="{@align}" class="tableinfo" >
			<xsl:apply-templates />
		</td>
	</xsl:template>
	
	<xsl:template match="ul">
		<div title="guideBlock">
			<ul title="guideList">
				<xsl:apply-templates />
			</ul>
		</div>
	</xsl:template>
	
	<xsl:template match="ol">
		<div title="guideBlock">
			<ol title="guideList">
				<xsl:apply-templates />
			</ol>
		</div>
	</xsl:template>
	
	<xsl:template match="li">
		<li>
			<xsl:apply-templates />
		</li>
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
	
</xsl:stylesheet>
