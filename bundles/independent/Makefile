# Change this to your image name
IMAGE_NAME := your/image

# Path to your sources
IMAGE_PATH := application

# Find all image sources
IMAGE_SOURCES := $(shell find $(IMAGE_PATH) -type f)

# Create the image tag from the commit date
IMAGE_TAG := $(shell git show --quiet --date=format:%Y.%m.%d --format=%cd)

all: image

ifneq ($(shell git status --porcelain),)
# The repository is dirty, deny pushes and mark image as dirty.
IMAGE_TAG := $(IMAGE_TAG)-dirty

push:
	@echo "There are unstaged changes in the repository, refusing push"
	@false
else
# The repository is clean, allow pushing images after building them.

push: image
	@docker push $(IMAGE_NAME):$(IMAGE_TAG)
endif

image: $(IMAGE_SOURCES)
	@docker build $(IMAGE_PATH) -t $(IMAGE_NAME):$(IMAGE_TAG)