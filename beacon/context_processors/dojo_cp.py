from beacon import settings


def dojo_cp(request):
	return { 'DOJO_LOCAL':settings.DOJO_LOCAL }

