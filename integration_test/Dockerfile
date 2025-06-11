FROM python:3.11-slim

WORKDIR /app

COPY integration_test.py .
COPY requirements.txt .

RUN pip install --no-cache-dir --no-warn-script-location -r requirements.txt

CMD ["python", "integration_test.py"]