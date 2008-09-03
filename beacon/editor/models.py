from django.db import models
from django.contrib import admin


class Document(models.Model):
	title = models.TextField()
	abstract = models.TextField()
	date = models.DateField()
	version = models.CharField(max_length=25)
	last_action = models.DateTimeField()
	key = models.CharField(max_length=16, unique=True)


class DocumentUser(models.Model):
	document = models.ForeignKey('Document')
	username = models.CharField(max_length=50)
	last_user_update = models.DateTimeField()


class Author(models.Model):
	document = models.ForeignKey('Document')
	title = models.CharField(max_length=100)
	first_name = models.CharField(max_length=100)
	last_name = models.CharField(max_length=100)
	middle_name = models.CharField(max_length=100, null=True, blank=True)
	email = models.EmailField()


class Chapter(models.Model):
	document = models.ForeignKey('Document')
	title = models.CharField(max_length=500)
	order = models.PositiveIntegerField()


class Section(models.Model):
	chapter = models.ForeignKey('Chapter')
	title = models.CharField(max_length=500)
	body = models.XMLField()
	order = models.PositiveIntegerField()


class ChatEntry(models.Model):
	timestamp = models.DateTimeField()
	user = models.ForeignKey('DocumentUser')
	message = models.TextField()

	class Meta:
		verbose_name_plural = "menu entries"


admin.site.register(Document, admin.ModelAdmin)
admin.site.register(DocumentUser, admin.ModelAdmin)
admin.site.register(Author, admin.ModelAdmin)
admin.site.register(Chapter, admin.ModelAdmin)
admin.site.register(Section, admin.ModelAdmin)
admin.site.register(ChatEntry, admin.ModelAdmin)

