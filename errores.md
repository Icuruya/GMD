PS C:\Users\Sistemas AFC\Documents\GMD\backend> venv\Scripts\uvicorn.exe main:app --reload
INFO:     Will watch for changes in these directories: ['C:\\Users\\Sistemas AFC\\Documents\\GMD\\backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [28964] using WatchFiles
INFO:     Started server process [29896]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     127.0.0.1:53929 - "POST /templates/placeholders HTTP/1.1" 200 OK
INFO:     127.0.0.1:53964 - "POST /jobs HTTP/1.1" 202 Accepted
INFO:     127.0.0.1:53964 - "GET /jobs/d9e95b9a-41db-4913-b0c7-bb11113e3652 HTTP/1.1" 200 OK
INFO:     127.0.0.1:53964 - "GET /jobs/d9e95b9a-41db-4913-b0c7-bb11113e3652 HTTP/1.1" 200 OK
INFO:     127.0.0.1:53964 - "GET /jobs/d9e95b9a-41db-4913-b0c7-bb11113e3652 HTTP/1.1" 500 Internal Server Error
ERROR:    Exception in ASGI application
Traceback (most recent call last):
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\uvicorn\protocols\http\httptools_impl.py", line 409, in run_asgi
    result = await app(  # type: ignore[func-returns-value]
             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
        self.scope, self.receive, self.send
        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    )
    ^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\uvicorn\middleware\proxy_headers.py", line 60, in __call__
    return await self.app(scope, receive, send)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\fastapi\applications.py", line 1054, in __call__
    await super().__call__(scope, receive, send)
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\starlette\applications.py", line 113, in __call__
    await self.middleware_stack(scope, receive, send)
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\starlette\middleware\errors.py", line 186, in __call__
    raise exc
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\starlette\middleware\errors.py", line 164, in __call__
    await self.app(scope, receive, _send)
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\starlette\middleware\cors.py", line 93, in __call__
    await self.simple_response(scope, receive, send, request_headers=headers)
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\starlette\middleware\cors.py", line 144, in simple_response
    await self.app(scope, receive, send)
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\starlette\middleware\exceptions.py", line 63, in __call__
    await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\starlette\_exception_handler.py", line 53, in wrapped_app
    raise exc
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\starlette\_exception_handler.py", line 42, in wrapped_app
    await app(scope, receive, sender)
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\starlette\routing.py", line 716, in __call__
    await self.middleware_stack(scope, receive, send)
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\starlette\routing.py", line 736, in app
    await route.handle(scope, receive, send)
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\starlette\routing.py", line 290, in handle
    await self.app(scope, receive, send)
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\starlette\routing.py", line 78, in app
    await wrap_app_handling_exceptions(app, request)(scope, receive, send)
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\starlette\_exception_handler.py", line 53, in wrapped_app
    raise exc
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\starlette\_exception_handler.py", line 42, in wrapped_app
    await app(scope, receive, sender)
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\starlette\routing.py", line 75, in app
    response = await f(request)
               ^^^^^^^^^^^^^^^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\fastapi\routing.py", line 302, in app
    raw_response = await run_endpoint_function(
                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    ...<3 lines>...
    )
    ^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\fastapi\routing.py", line 213, in run_endpoint_function
    return await dependant.call(**values)
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\main.py", line 117, in get_job_status
    return JSONResponse(response)
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\starlette\responses.py", line 190, in __init__
    super().__init__(content, status_code, headers, media_type, background)
    ~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\starlette\responses.py", line 47, in __init__
    self.body = self.render(content)
                ~~~~~~~~~~~^^^^^^^^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\starlette\responses.py", line 193, in render
    return json.dumps(
           ~~~~~~~~~~^
        content,
        ^^^^^^^^
    ...<3 lines>...
        separators=(",", ":"),
        ^^^^^^^^^^^^^^^^^^^^^^
    ).encode("utf-8")
    ^
  File "C:\Users\Sistemas AFC\AppData\Local\Programs\Python\Python313\Lib\json\__init__.py", line 238, in dumps
    **kw).encode(obj)
          ~~~~~~^^^^^
  File "C:\Users\Sistemas AFC\AppData\Local\Programs\Python\Python313\Lib\json\encoder.py", line 200, in encode
    chunks = self.iterencode(o, _one_shot=True)
  File "C:\Users\Sistemas AFC\AppData\Local\Programs\Python\Python313\Lib\json\encoder.py", line 261, in iterencode
    return _iterencode(o, 0)
  File "C:\Users\Sistemas AFC\AppData\Local\Programs\Python\Python313\Lib\json\encoder.py", line 180, in default
    raise TypeError(f'Object of type {o.__class__.__name__} '
                    f'is not JSON serializable')
TypeError: Object of type AttributeError is not JSON serializable


PS C:\Users\Sistemas AFC\Documents\GMD\backend> venv\Scripts\celery.exe -A celery_worker.celery_app worker --loglevel=info -P eventlet
1 RLock(s) were not greened, to fix this error make sure you run eventlet.monkey_patch() before importing any other modules.

 -------------- celery@DESKTOP-67V0V98 v5.5.3 (immunity)
--- ***** -----
-- ******* ---- Windows-11-10.0.26100-SP0 2025-07-21 16:07:36
- *** --- * ---
- ** ---------- [config]
- ** ---------- .> app:         tasks:0x11dadcee850
- ** ---------- .> transport:   redis://localhost:6379/0
- ** ---------- .> results:     redis://localhost:6379/0
- *** --- * --- .> concurrency: 12 (eventlet)
-- ******* ---- .> task events: OFF (enable -E to monitor tasks in this worker)
--- ***** -----
 -------------- [queues]
                .> celery           exchange=celery(direct) key=celery


[tasks]
  . celery_worker.generate_documents_task

[2025-07-21 16:07:36,062: INFO/MainProcess] Connected to redis://localhost:6379/0
[2025-07-21 16:07:36,079: INFO/MainProcess] mingle: searching for neighbors
[2025-07-21 16:07:37,145: INFO/MainProcess] mingle: all alone
[2025-07-21 16:07:37,206: INFO/MainProcess] celery@DESKTOP-67V0V98 ready.
[2025-07-21 16:07:37,207: INFO/MainProcess] pidbox: Connected to redis://localhost:6379/0.
[2025-07-21 16:09:00,181: INFO/MainProcess] Task celery_worker.generate_documents_task[d9e95b9a-41db-4913-b0c7-bb11113e3652] received
[2025-07-21 16:09:03,239: ERROR/MainProcess] Task celery_worker.generate_documents_task[d9e95b9a-41db-4913-b0c7-bb11113e3652] raised unexpected: AttributeError("'_Cell' object has no attribute 'runs'")
Traceback (most recent call last):
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\celery\app\trace.py", line 453, in trace_task
    R = retval = fun(*args, **kwargs)
                 ~~~^^^^^^^^^^^^^^^^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\celery\app\trace.py", line 736, in __protected_call__
    return self.run(*args, **kwargs)
           ~~~~~~~~^^^^^^^^^^^^^^^^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\celery_worker.py", line 140, in generate_documents_task
    raise e # Re-lanzar la excepción para que Celery la marque como FAILURE
    ^^^^^^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\celery_worker.py", line 99, in generate_documents_task
    replace_placeholders_in_doc(doc, data_for_row)
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\celery_worker.py", line 51, in replace_placeholders_in_doc
    _replace_in_paragraph_or_cell(cell)
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\celery_worker.py", line 18, in _replace_in_paragraph_or_cell
    original_runs = list(paragraph_or_cell.runs) # Copia de los runs originales
                         ^^^^^^^^^^^^^^^^^^^^^^
AttributeError: '_Cell' object has no attribute 'runs'