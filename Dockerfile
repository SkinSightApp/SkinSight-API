FROM python:3.11.4

WORKDIR /

RUN pip install -r requirements.txt

COPY . .

ENV PYTHONUNBUFFERED=1

ENV HOST 0.0.0.0

EXPOSE 5000

CMD ["python", "app.py"]