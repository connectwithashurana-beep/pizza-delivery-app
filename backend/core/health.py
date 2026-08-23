import redis
from django.conf import settings
from django.db import connection
from django.http import JsonResponse


def health_check(request):
    checks = {}

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
        checks["database"] = "ok"
    except Exception:
        checks["database"] = "error"

    try:
        redis.from_url(settings.REDIS_URL, socket_connect_timeout=2).ping()
        checks["redis"] = "ok"
    except Exception:
        checks["redis"] = "error"

    healthy = all(value == "ok" for value in checks.values())
    if healthy:
        # Keep the established healthy response contract stable for monitors and clients.
        return JsonResponse({"status": "ok"})
    return JsonResponse(
        {"status": "unhealthy", "checks": checks},
        status=503,
    )
