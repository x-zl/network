
def klog(str, obj=None):
    print('--debug--')
    print(str)
    if obj != None:
        print(repr(obj))
    print('--debug--')
