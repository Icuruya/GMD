PS C:\Users\Sistemas AFC\Documents\GMD\backend> venv\Scripts\uvicorn.exe main:app --reload
INFO:     Will watch for changes in these directories: ['C:\\Users\\Sistemas AFC\\Documents\\GMD\\backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [28808] using WatchFiles
INFO:     Started server process [22932]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     127.0.0.1:58551 - "GET /jobs HTTP/1.1" 500 Internal Server Error
ERROR:    Exception in ASGI application
Traceback (most recent call last):
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\sqlalchemy\orm\mapper.py", line 2522, in get_property
    return self._props[key]
           ~~~~~~~~~~~^^^^^
KeyError: 'templates'

The above exception was the direct cause of the following exception:

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
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\main.py", line 198, in get_all_jobs
    jobs = db.query(models.GenerationJob).all()
           ~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\sqlalchemy\orm\session.py", line 2955, in query
    return self._query_cls(entities, self, **kwargs)
           ~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\sqlalchemy\orm\query.py", line 276, in __init__
    self._set_entities(entities)
    ~~~~~~~~~~~~~~~~~~^^^^^^^^^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\sqlalchemy\orm\query.py", line 289, in _set_entities
    coercions.expect(
    ~~~~~~~~~~~~~~~~^
        roles.ColumnsClauseRole,
        ^^^^^^^^^^^^^^^^^^^^^^^^
    ...<2 lines>...
        post_inspect=True,
        ^^^^^^^^^^^^^^^^^^
    )
    ^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\sqlalchemy\sql\coercions.py", line 388, in expect
    insp._post_inspect
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\sqlalchemy\util\langhelpers.py", line 1338, in __get__
    obj.__dict__[self.__name__] = result = self.fget(obj)
                                           ~~~~~~~~~^^^^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\sqlalchemy\orm\mapper.py", line 2724, in _post_inspect
    self._check_configure()
    ~~~~~~~~~~~~~~~~~~~~~^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\sqlalchemy\orm\mapper.py", line 2401, in _check_configure
    _configure_registries({self.registry}, cascade=True)
    ~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\sqlalchemy\orm\mapper.py", line 4214, in _configure_registries
    _do_configure_registries(registries, cascade)
    ~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\sqlalchemy\orm\mapper.py", line 4255, in _do_configure_registries
    mapper._post_configure_properties()
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\sqlalchemy\orm\mapper.py", line 2418, in _post_configure_properties
    prop.init()
    ~~~~~~~~~^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\sqlalchemy\orm\interfaces.py", line 589, in init
    self.do_init()
    ~~~~~~~~~~~~^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\sqlalchemy\orm\relationships.py", line 1661, in do_init
    self._generate_backref()
    ~~~~~~~~~~~~~~~~~~~~~~^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\sqlalchemy\orm\relationships.py", line 2145, in _generate_backref
    self._add_reverse_property(self.back_populates)
    ~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\sqlalchemy\orm\relationships.py", line 1592, in _add_reverse_property
    other = self.mapper.get_property(key, _configure_mappers=False)
  File "C:\Users\Sistemas AFC\Documents\GMD\backend\venv\Lib\site-packages\sqlalchemy\orm\mapper.py", line 2524, in get_property
    raise sa_exc.InvalidRequestError(
    ...<3 lines>...
    ) from err
sqlalchemy.exc.InvalidRequestError: Mapper 'Mapper[User(users)]' has no property 'templates'.  If this property was indicated from other mappers or configure events, ensure registry.configure() has been called.
