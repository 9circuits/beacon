# Copyright 1999-2006 Gentoo Foundation
# Distributed under the terms of the GNU General Public License v2
# $Header: $

inherit webapp depend.php

DESCRIPTION="RESTful web service for Repodoc with a sample client"
HOMEPAGE="http://www.kix.in/soc/repodoc/"
SRC_URI="http://www.kix.in/soc/repodoc/${P}.tar.bz2"

LICENSE="GPL-2"
KEYWORDS="~x86"
IUSE=""

RDEPEND=">=dev-lang/php-5.1.2
	 >=app-doc/repodoc-0.3_beta"
S=${WORKDIR}/${PN}

pkg_setup() {
	webapp_pkg_setup

	if ! require_php_with_use curl xml xsl ; then
		eerror
		eerror "${PHP_PKG} needs to be re-installed with all of the following"
		eerror "USE flags enabled:"
		eerror
		eerror "curl xml xsl"
		eerror
		die "Re-install ${PHP_PKG}"
	fi
}

src_unpack() {
	unpack ${A}
}

src_install() {
	webapp_src_preinst
	cd ${S}
	cp -R . ${D}/${MY_HTDOCSDIR}
	webapp_serverowned -R ${MY_HTDOCSDIR}/validate/htdocs
	webapp_serverowned -R ${MY_HTDOCSDIR}/repotemp
	webapp_src_install
}

pkg_postinst() {
	webapp_pkg_postinst

	einfo "repodoc-web has been successfully installed!"
	einfo "Please don't forget to set the REPODOC_HOME "
	einfo "environment variable to a directory that is "
	einfo "writeable by the web-server; preferably to  "
	einfo "<htdocs>/repodoc-web/repotemp. You may set  "
	einfo "the variable in your .bashrc file to make   "
	einfo "things a lot easier.                        "
	einfo "                                            "
	einfo "You can access the repodoc-web client at    "
	einfo "http://localhost/repodoc-web/               "
	einfo "while the REST service is located at        "
	einfo "http://localhost/repodoc-web/validate       "
}
