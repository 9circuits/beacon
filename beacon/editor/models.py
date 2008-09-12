from django.db import models
from django.contrib import admin
from random import choice
from xml.dom.ext.reader import Sax2
from xml import xpath
from xml.dom.ext import Print
import StringIO


class DocumentManager(models.Manager):
	def parse_document(self, xml_document):
		reader = Sax2.Reader()
		doc = reader.fromString(xml_document)

		doc_elem = doc.documentElement

		try:
			lang = xpath.Evaluate('attribute::lang', doc_elem)[0].nodeValue
		except IndexError:
			lang = None

		try:
			link = xpath.Evaluate('attribute::link', doc_elem)[0].nodeValue
		except IndexError:
			link = None

		title = xpath.Evaluate('child::title/child::text()', doc_elem)[0].nodeValue

		author_nodes = xpath.Evaluate('child::author', doc_elem)
		authors = []

		for a in author_nodes:
			atitle = xpath.Evaluate('attribute::title', a)[0].nodeValue
			try:
				mail_node = xpath.Evalutate('child::mail', a)[0]
				aemail = xpath.Evalutate('attribute::link', mail_node)[0].nodeValue
				aname = xpath.Evalute('child::text()', mail_node)[0].nodeValue
			except:
				aemail = None
				aname = xpath.Evaluate('child::text()', a)[0].nodeValue
			authors.append({'title':atitle, 'email':aemail, 'name':aname})

		abstract = xpath.Evaluate('child::abstract/child::text()', doc_elem)[0].nodeValue

		license_node = xpath.Evaluate('child::license', doc_elem)
		if len(license_node) > 0:
			license = True
		else:
			license = False

		version = xpath.Evaluate('child::version/child::text()', doc_elem)[0].nodeValue
		date = xpath.Evaluate('child::date/child::text()', doc_elem)[0].nodeValue

		chapter_nodes = xpath.Evaluate('child::chapter', doc_elem)
		chapters = []

		for c in chapter_nodes:
			ctitle = xpath.Evaluate('child::title/child::text()', c)[0].nodeValue

			section_nodes = xpath.Evaluate('child::section', c)
			sections = []

			for s in section_nodes:
				stitle = xpath.Evaluate('child::title/child::text()', s)[0].nodeValue

				sio = StringIO.StringIO()

				Print(xpath.Evaluate('child::body', s)[0], sio)

				body = sio.getvalue()
				
				sections.append({'title':stitle, 'body':body})

			chapters.append({'title':ctitle, 'sections':sections})

		document = {'title':title, 'link':link, 'language':lang, 'abstract':abstract, 'date':date, 'version':version, 'chapters':chapters}

		return document
	

	def create_document(self, document):
		document = document.copy()
		chapters = document['chapters']
		del document['chapters']

		key = self.make_random_key()

		key_unique = False

		while not key_unique:
			try:
				doc = self.create(key=key, **document)
				doc.save()
				key_unique = True
			except:
				key = self.make_random_key()

		corder = 1
		for c in chapters:
			chap = Chapter(document=doc, title=c['title'], order=corder)
			chap.save()
			sorder = 1
			for s in c['sections']:
				sect = Section(chapter=chap, title=s['title'], body=s['body'], order=sorder)
				sect.save()
				sorder += 1
			corder += 1

		return doc


	def make_random_key(self):
		chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
		return ''.join([choice(chars) for i in range(16)])


class Document(models.Model):
	title = models.TextField()
	link = models.URLField(verify_exists=False, null=True, blank=True)
	language = models.CharField(max_length=50, null=True, blank=True)
	abstract = models.TextField()
	date = models.DateField()
	version = models.CharField(max_length=25)
	last_action = models.DateTimeField(auto_now=True)
	key = models.CharField(max_length=16, unique=True)

	objects = DocumentManager()

	def to_xml(self):
		out = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
		out += "<!DOCTYPE guide SYSTEM \"/dtd/guide.dtd\">\n"
		out += "<!-- $Header$ -->\n\n"
		out += "<guide"
		if self.link is not None:
			out += " link=\"" + self.link + "\""
		if self.language is not None:
			out += " lang=\"" + self.language + "\""

		out += "<title>" + self.title + "</title>\n\n"
		for a in self.author_set.all():
			out += a.to_xml()

		out += "\n<abstract>\n" + self.abstract + "\n</abstract>\n\n"

		out += "<license />\n\n"

		out += "<version>" + self.version + "</version>\n"
		out += "<date>" + self.date.strftime("%Y-%m-%d") + "</date>\n\n"

		for c in self.chapter_set.all():
			out += c.to_xml()

		out += "</guide>\n"

		return out

	def __unicode__(self):
		return self.title


class DocumentUser(models.Model):
	document = models.ForeignKey('Document')
	username = models.CharField(max_length=50)
	last_user_update = models.DateTimeField()

	def __unicode__(self):
		return self.username


class Author(models.Model):
	document = models.ForeignKey('Document')
	title = models.CharField(max_length=100, null=True, blank=True)
	first_name = models.CharField(max_length=100)
	last_name = models.CharField(max_length=100)
	middle_name = models.CharField(max_length=100, null=True, blank=True)
	email = models.EmailField()

	def to_xml(self):
		out = "<author"
		if self.title is not None:
			out += " title=\"" + self.title + "\""
		out += ">\n"
		out += "	"
		if self.email is not None:
			out += "<mail link=\"" + self.email + "\">" + self.name() + "</mail>\n"
		else:
			out += self.name() + "\n"
		out += "</author>\n"
		
		return out
	
	def name(self):
		if self.middle_name is not None:
			return self.first_name + " " + self.middle_name + " " + self.last_name
		else:
			return self.first_name + " " + self.last_name

	def __unicode__(self):
		return self.first_name + " " + self.last_name


class Chapter(models.Model):
	document = models.ForeignKey('Document')
	title = models.CharField(max_length=500)
	order = models.PositiveIntegerField()

	def to_xml(self):
		out = "<chapter>\n"
		out += "<title>" + self.title + "</title>\n"
		for s in self.section_set.all():
			out += s.to_xml()
		out += "</chapters>\n"

		return out

	def __unicode__(self):
		return self.title

	class Meta:
		ordering = ('order',)


class Section(models.Model):
	chapter = models.ForeignKey('Chapter')
	title = models.CharField(max_length=500)
	body = models.XMLField()
	order = models.PositiveIntegerField()

	def to_xml(self):
		out = "<section>\n"
		out += "<title>" + self.title + "</title>\n"
		out += self.body
		out += "\n</section>\n"

		return out

	def __unicode__(self):
		return self.title

	class Meta:
		ordering = ('order',)


class ChatEntry(models.Model):
	timestamp = models.DateTimeField()
	user = models.ForeignKey('DocumentUser')
	message = models.TextField()

	class Meta:
		verbose_name_plural = "menu entries"


"""
admin.site.register(Document, admin.ModelAdmin)
admin.site.register(DocumentUser, admin.ModelAdmin)
admin.site.register(Author, admin.ModelAdmin)
admin.site.register(Chapter, admin.ModelAdmin)
admin.site.register(Section, admin.ModelAdmin)
admin.site.register(ChatEntry, admin.ModelAdmin)
"""
