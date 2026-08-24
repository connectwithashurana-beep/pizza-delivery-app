import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.db import connection

with connection.cursor() as cursor:
    cursor.execute("""
        SELECT app, name
        FROM django_migrations
        WHERE app = 'admin' AND name = '0001_initial'
    """)
    admin_migration = cursor.fetchone()

    cursor.execute("""
        SELECT app, name
        FROM django_migrations
        WHERE app = 'accounts' AND name = '0001_initial'
    """)
    accounts_migration = cursor.fetchone()

print("Admin migration:", admin_migration)
print("Accounts migration:", accounts_migration)

if admin_migration and not accounts_migration:
    print("Migration history is inconsistent.")
    print("Removing admin.0001_initial migration record...")

    cursor.execute("""
        DELETE FROM django_migrations
        WHERE app = 'admin' AND name = '0001_initial'
    """)

    print("admin.0001_initial record removed successfully.")
else:
    print("No repair needed.")