def ensure_trailing_slash(input_string):
    if not input_string.endswith('/'):
        input_string += '/'
    return input_string
