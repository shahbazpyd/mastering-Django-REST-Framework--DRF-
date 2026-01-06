#!/bin/bash
set -e  # exit on any error

echo "=== Starting Django entrypoint ==="

# Collect static files
if [ "$DJANGO_COLLECTSTATIC" = "1" ] || [ "$DJANGO_COLLECTSTATIC" = "true" ]; then
    echo "Running collectstatic..."
    python manage.py collectstatic --noinput --clear
fi

# Apply database migrations
if [ "$DJANGO_MIGRATE" = "1" ] || [ "$DJANGO_MIGRATE" = "true" ]; then
    echo "Running migrations..."
    python manage.py migrate --noinput
fi

# Create superuser (first run only, optional)
# if [ "$DJANGO_SUPERUSER" = "1" ]; then
#     echo "Creating superuser..."
#     python manage.py createsuperuser \
#         --noinput \
#         --username admin \
#         --email admin@example.com || true
# fi

# Start the main process (passed as arguments)
echo "Starting main process: $@"
exec "$@"
