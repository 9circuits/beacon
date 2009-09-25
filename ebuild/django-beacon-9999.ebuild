# Copyright 1999-2008 Gentoo Foundation
# Distributed under the terms of the GNU General Public License v2
# $Header: /var/cvsroot/gentoo-x86/www-apps???/???.ebuild,v 1.1 2009/01/07 16:40:16 quantumsummers Exp $

EAPI="2"
SUPPORT_PYTHON_ABIS="1"
RESTRICT_PYTHON_ABIS="3*"

inherit distutils multilib webapp versionator

#example for local overlay 
#At=beacon-${PV}.tar.gz

DESCRIPTION=""
HOMEPAGE="http://"
SRC_URI="${At}"
SLOT="0"
WEBAPP_MANUAL_SLOT="yes"
LICENSE=""
KEYWORDS="~x86 ~amd64"
RESTRICT="fetch test"
IUSE="mysql"

DEPEND=">=dev-lang/python-2.5
	>=dev-python/django-1.0
	>=dev-python/simplejson-1.7.1
	mysql? ( >=dev-python/mysql-python-1.2.1_p2 )"

RDEPEND="${DEPEND}
	dev-python/python-dateutil
	dev-python/4suite

S="${WORKDIR}/${P}"

src_unpack() {
	distutils_src_unpack
	unpack ${A}
	cd "${S}"
}

src_compile() {
	distutils_src_compile
}

src_install() {
	distutils_python_version
	site_pkgs="$(python_get_sitedir)"
	export PYTHONPATH="${PYTHONPATH}:${D}/${site_pkgs}"
	dodir ${site_pkgs}

	distutils_src_install

	insinto "${MY_HTDOCSDIR}"
	doins -r "${D}/${site_pkgs}"/"${PN}"/media/*

	insinto /etc/${PN}
	insopts -m0640
	doins -r "${D}/${site_pkgs}"/"${PN}"/settings_*.py

	webapp_serverowned -R "${MY_HTDOCSDIR}"/library

	#webapp_postinst_txt en "${FILESDIR}"/postinstall-en.txt
	
	webapp_src_install

	rm -rf "${D}/${site_pkgs}"/"${PN}"/settings_*.py
	rm -rf "${D}/${site_pkgs}"/"${PN}"/media
	fowners root:apache /etc/"${PN}"/settings_*.py
}

pkg_postinst() {
	distutils_pkg_postinst
	einfo "Now, "${PN}" has the best of both worlds with Gentoo,"
	einfo "ease of deployment for production and development."
	echo
	elog "A copy of the media is available to"
	elog "webapp-config for installation in a webroot,"
	elog "as well as the traditional location in python's"
	elog "site-packages dir for easy development"
	echo
	echo
	ewarn "If you build "${PN}" without USE=\"vhosts\""
	ewarn "webapp-config will automatically install the"
	ewarn "application media into the localhost webroot."
}
