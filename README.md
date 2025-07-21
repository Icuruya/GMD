# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

En una terminal cada una debes ir a backend y ejecutar dos comandos

venv\Scripts\celery.exe -A celery_worker.celery_app worker --loglevel=info -P eventlet

venv\Scripts\uvicorn.exe main:app --reload

y para frontend en GMD directamente

npm run dev