FROM python:3.11-slim

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

RUN groupadd -g 101 nginx && useradd -u 101 -g 101 -M -d /app nginx
RUN mkdir -p /resources && chown -R nginx:nginx /app /resources

USER nginx

CMD ["python", "test_creator.py"]