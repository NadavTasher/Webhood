from server import main, router  # NOQA

@router.get("/ping")
def ping(request):
	return True

if __name__ == "__main__":
    main()
