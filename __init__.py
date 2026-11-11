import sys
from types import ModuleType


def register(ctx):
    # Host imports API modules separately; defer the SDK facade until a request.
    runtime = ModuleType('slide_studio_runtime')
    setattr(runtime, 'context', ctx)
    sys.modules['slide_studio_runtime'] = runtime
