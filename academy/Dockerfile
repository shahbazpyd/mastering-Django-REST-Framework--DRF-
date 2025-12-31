# 1. Base image
FROM python:3.13-slim

# 2. Environment settings
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3. Workdir in container
WORKDIR /app

# 4. System deps (if needed, keep minimal for now)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 5. Copy requirements and install
COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy project code
COPY . /app/

# 7. Expose port (Daphne will listen here)
EXPOSE 8000

# 8. Default command: run migrations, then start Daphne
CMD ["sh", "-c", "python manage.py migrate && daphne -b 0.0.0.0 -p 8000 academy.asgi:application"]
