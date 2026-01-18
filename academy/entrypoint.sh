#!/bin/bash
set -e

echo "=== Starting Django entrypoint ==="

# 1. NEW: Wait for Postgres to be ready
if [ "$DATABASE" = "postgres" ]; then
    echo "Waiting for postgres..."
    # 'db' is the name of your service in docker-compose.yml
    while ! nc -z db 5432; do
      echo "Postgres is unavailable - sleeping"
      sleep 1
    done
    echo "PostgreSQL started!"
fi

# 2. Collect static files
if [ "$DJANGO_COLLECTSTATIC" = "1" ]; then
    echo "Running collectstatic..."
    python manage.py collectstatic --noinput
fi

# 3. Apply database migrations
if [ "$DJANGO_MIGRATE" = "1" ]; then
    echo "Running migrations..."
    python manage.py migrate --noinput
fi

echo "Starting main process: $@"
exec "$@"


# #!/bin/bash
# set -e  # exit on any error

# echo "=== Starting Django entrypoint ==="

# # Collect static files
# if [ "$DJANGO_COLLECTSTATIC" = "1" ] || [ "$DJANGO_COLLECTSTATIC" = "true" ]; then
#     echo "Running collectstatic..."
#     python manage.py collectstatic --noinput --clear
# fi

# # Apply database migrations
# if [ "$DJANGO_MIGRATE" = "1" ] || [ "$DJANGO_MIGRATE" = "true" ]; then
#     echo "Running migrations..."
#     python manage.py migrate --noinput
# fi

# # Create superuser (first run only, optional)
# # if [ "$DJANGO_SUPERUSER" = "1" ]; then
# #     echo "Creating superuser..."
# #     python manage.py createsuperuser \
# #         --noinput \
# #         --username admin \
# #         --email admin@example.com || true
# # fi

# # Start the main process (passed as arguments)
# echo "Starting main process: $@"
# exec "$@"

