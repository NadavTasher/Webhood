from server import main, router  # NOQA
from puppy.typing.check import kwargcheck
# from puppy.typing.types import Text

@router.get("/test")
@kwargcheck(hello=str)
def test(request, hello=None):
	return "%s World" % hello

if __name__ == "__main__":
    main()
