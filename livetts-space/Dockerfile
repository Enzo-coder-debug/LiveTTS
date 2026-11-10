FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    HOME=/home/user

RUN useradd --create-home --uid 1000 user
WORKDIR /home/user/app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY --chown=user:user app.py provider.py ./
COPY --chown=user:user static ./static
USER user
EXPOSE 7860
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860", "--workers", "1", "--no-access-log"]
