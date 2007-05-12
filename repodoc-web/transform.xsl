<?xml version="1.0" encoding="ISO-8859-1"?>

<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
    <html>
    <body>
        <h2>Repodoc Validation Result</h2>
        <table border="1">
            <tr bgcolor="#7a5ada">
                <th align="left"> </th>
                <th align="left">Module</th>
                <th align="left">Result</th>
                <th align="left">Reason</th>
            </tr>
        <xsl:for-each select="repodoc-result/module">
            <tr>
                <xsl:choose>
                    <xsl:when test="@result = 'critical'">
                        <td bgcolor="red"> </td>
                    </xsl:when>
                    <xsl:when test="@result = 'warning'">
                        <td bgcolor="yellow"> </td>
                    </xsl:when>
                    <xsl:otherwise>
                        <td bgcolor="green"> </td>
                    </xsl:otherwise>
                </xsl:choose>
                <td><xsl:value-of select="@id"/></td>
                <td><xsl:value-of select="@result"/></td>
                <td><xsl:value-of select="reason"/></td>
            </tr>
        </xsl:for-each>
        </table>
        <h3><a href="index.php">Check another file</a></h3>
    </body>
    </html>
</xsl:template>

</xsl:stylesheet>
