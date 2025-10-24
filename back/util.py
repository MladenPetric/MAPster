import functools
from itertools import chain


def response_status(lambda_ = None, /, *, code = 200):
    def decorator(f):
        @functools.wraps(f)
        def wrapper(*args, **kwargs):
            response = f(*args, **kwargs)

            if isinstance(response, dict):
                response.setdefault('statusCode', code)

            return response

        return wrapper

    return decorator if lambda_ is None else decorator(lambda_)


def response_headers(lambda_ = None, /, *, headers: dict[str, object] | None = None, **kwheaders):
    headers_ = dict(*chain(headers.items() if headers else {}, kwheaders))

    def decorator(f):
        @functools.wraps(f)
        def wrapper(*args, **kwargs):
            response = f(*args, **kwargs)

            if not headers_:
                return response
            
            if isinstance(response, dict):
                response_headers = response.setdefault('headers', {})

                if isinstance(response_headers, dict):
                    for header, value in headers_:
                        response_headers.setdefault(header, str(value))

            return response
    
    return decorator if lambda_ is None else decorator(lambda_)


def default_headers(
    lambda_ = None, 
    /, *, 
    content_type = 'application/json',
    allow_origin = '*',
    allow_methods = 'GET, POST, PUT, DELETE, OPTIONS',
    allow_headers = 'Content-Type, Authorization',
    headers: dict[str, object] | None = None, 
    **kwheaders,
):
    return response_headers(
        lambda_, 
        headers = {
            **(headers or {}),
            **{
                'Content-Type': content_type,
                "Access-Control-Allow-Origin": allow_origin,
                "Access-Control-Allow-Methods": allow_methods,
                "Access-Control-Allow-Headers": allow_headers,
            }, 
            **kwheaders
        }
    )