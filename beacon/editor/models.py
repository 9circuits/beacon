import os
import re
import simplejson

from django.contrib.auth.models import User
from django.conf import settings
from django.db import models
from django.template.loader import render_to_string

from Ft.Xml.Xslt import Processor
from Ft.Xml import InputSource

from beacon.logger import log
from beacon.editor.hacks import clean_src

class DocumentManager(models.Manager):

    def apply_xsl_to_src(self, stylesheet, src, debug=False):
        """ Convert src doc according to xsl stylesheet 
        expects stylesheet and xmltemplate to be file paths
        """
        if debug:
            srcfile = os.path.join(tempfile.gettempdir(), 'srcfile.txt')
            open(srcfile,'w').write(src)

        # nasty hack to clean src for guidexml xslt
        src = clean_src(src)

        sty = InputSource.DefaultFactory.fromString(stylesheet, uri='file:///stylesheet')
        src = InputSource.DefaultFactory.fromString(str(src),uri='file:///src')

        proc = Processor.Processor()
        proc.appendStylesheet(sty)
        output = proc.run(src)
        return output

    def get_new_template_html(self, format):
        """ Get html contents of a new template for format (currently only guidexml/docbook supported)"""
        xmltemplate = os.path.join(settings.XML_DIR, 'new-%s-template.xml' % format)
        xmlfile = open(xmltemplate,'r')
        xmltemplate = xmlfile.read()
        xmlfile.close()
        return self.xml_to_html(xmltemplate, format)

    def get_new_template_xml(self, format):
        """ Return the xml source (as a str) of a new template for format (currently only guidexml/docbook) supported"""
        xmltemplate = os.path.join(settings.XML_DIR, 'new-%s-template.xml' % format)
        xmlfile = open(xmltemplate,'r')
        xmlsrc = xmlfile.read()
        xmlfile.close()
        return xmlsrc

    def xml_to_html(self, xml, format):
        stylesheet = os.path.join(settings.XSLT_DIR,'%s2html.xsl' % format)
        stylefile = open(stylesheet,'r')
        stylesheet = stylefile.read()
        stylefile.close()
        return self.apply_xsl_to_src(stylesheet, xml)

    def html_to_xml(self, html, format):
        stylesheet = os.path.join(settings.XSLT_DIR,'html2%s.xsl' % format)
        stylefile = open(stylesheet,'r')
        stylesheet = stylefile.read()
        stylefile.close()
        return self.apply_xsl_to_src(stylesheet, html)

    def create_new_document(self, user, name, format):
        html = self.get_new_template_html(format)
        source = self.get_new_template_xml(format)
        doc = Document(user=user, name=name, format=format, source=source, html=html)
        doc.save()
        return doc

    def get_docs_for_user(self, user):
        return Document.objects.filter(user=user)

class RevisionManager(models.Manager):
    pass

class Document(models.Model):
    #$beacon_create_documents_table = "CREATE TABLE `beacon`.`beacon_documents` (
    #`id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    #`name` VARCHAR(32) NOT NULL,
    #`plugin` VARCHAR(32) NOT NULL,
    #`username` VARCHAR(32) NOT NULL,
    #`source` TEXT NOT NULL,
    #`html` TEXT NOT NULL,
    #`created` VARCHAR(64) NOT NULL
    #)";
    objects = DocumentManager()
    user = models.ForeignKey(User)
    name = models.CharField(max_length=512)
    format = models.CharField(max_length=64)
    source = models.TextField()
    html = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    def save(self, force_insert=False, force_update=False):
        super(Document, self).save(force_insert, force_update)
        log.info('Saving Document %s' % self.name)
        # create revision
        rev = Revision(doc=self, revid=self.revision_set.count()+1)
        rev.html = self.html
        rev.source = self.source
        rev.save()

    def get_ui_html(self):
        html = render_to_string('editor/document.html', {'id':self.id,
        'src':'handler?plugin=%s&id=%s&type=html' % (self.format, self.id), 
        'MEDIA_URL':settings.MEDIA_URL})
        return html

    def get_revisions_json(self):
        """ Returns a json representation of this doc's revisions"""
        #{"revisions":[{"id":"80","docid":"16","time":"2009-10-01
        #10:46:02","num":"3"},{"id":"79","docid":"16","time":"2009-10-01
        #10:41:02","num":"2"},{"id":"78","docid":"16","time":"2009-10-01
        #10:36:02","num":"1"},{"id":"77","docid":"16","time":"2009-10-01
        #10:31:17","num":"0"}]}
        json_dict = {}

        revs = json_dict['revisions'] = []
        for rev in self.revision_set.all().order_by('-pk'):
            revision = {'id':rev.id, 'docid': self.id, 'time':
            rev.timestamp.strftime("%Y-%m-%d %H:%M:%S"), 
            'num':rev.revid}
            revs.append(revision)
        return simplejson.dumps(json_dict) 

class Revision(models.Model):
    #$beacon_create_revisions_table = "CREATE TABLE `beacon`.`beacon_revisions` (
    #`id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    #`docid` VARCHAR(32) NOT NULL,
    #`num` INT UNSIGNED NOT NULL,
    #`source` TEXT NOT NULL,
    #`html` TEXT NOT NULL,
    #`timestamp` VARCHAR(64) NOT NULL,
    #`diff` TEXT NOT NULL
    #)";
    doc = models.ForeignKey(Document, null=False, blank=False)
    revid = models.IntegerField()
    source = models.TextField()
    html = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    diff = models.TextField(null=True, blank=True)

    def save(self, force_insert=False, force_update=False):
        log.info('Creating Revision Point for doc: %s' % self.doc.name)
        super(Revision, self).save(force_insert, force_update)
