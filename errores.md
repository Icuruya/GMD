
PS C:\Users\Sistemas AFC> cd .\Documents\
PS C:\Users\Sistemas AFC\Documents> cd .\GMD\
PS C:\Users\Sistemas AFC\Documents\GMD> cd .\backend\
PS C:\Users\Sistemas AFC\Documents\GMD\backend> venv\Scripts\uvicorn.exe main:app --reload
INFO:     Will watch for changes in these directories: ['C:\\Users\\Sistemas AFC\\Documents\\GMD\\backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [4556] using WatchFiles
INFO:     Started server process [3284]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     127.0.0.1:63094 - "GET /projects HTTP/1.1" 200 OK
INFO:     127.0.0.1:63094 - "GET /projects/1/jobs HTTP/1.1" 200 OK
INFO:     127.0.0.1:63096 - "GET /projects/1/jobs HTTP/1.1" 200 OK
INFO:     127.0.0.1:63096 - "GET /projects/1/jobs HTTP/1.1" 200 OK
INFO:     127.0.0.1:63096 - "GET /projects/1/templates HTTP/1.1" 200 OK
INFO:     127.0.0.1:63103 - "GET /projects/1/templates HTTP/1.1" 200 OK
INFO:     127.0.0.1:63110 - "POST /templates HTTP/1.1" 500 Internal Server Error
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
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\main.py", line 94, in create_template
    db_template = models.Template(name=file.filename, file_path=file_path, project_id=project_id, owner_id=1) # owner_id hardcodeado por ahora
  File "<string>", line 4, in __init__
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\sqlalchemy\orm\state.py", line 571, in _initialize_instance
    with util.safe_reraise():
         ~~~~~~~~~~~~~~~~~^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\sqlalchemy\util\langhelpers.py", line 224, in __exit__
    raise exc_value.with_traceback(exc_tb)
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\sqlalchemy\orm\state.py", line 569, in _initialize_instance
    manager.original_init(*mixed[1:], **kwargs)
    ~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\sqlalchemy\orm\decl_base.py", line 2173, in _declarative_constructor
    raise TypeError(
        "%r is an invalid keyword argument for %s" % (k, cls_.__name__)
    )
TypeError: 'owner_id' is an invalid keyword argument for Template
INFO:     127.0.0.1:63113 - "GET /projects/1/templates HTTP/1.1" 200 OK
INFO:     127.0.0.1:63114 - "GET /projects/1/templates HTTP/1.1" 200 OK