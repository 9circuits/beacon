from beacon import settings


def beacon_cp(request):
	return { 'BEACON_VERSION':settings.BEACON_VERSION }

