# Change this to your image name
IMAGE_NAME := your/image

# Path to your sources
IMAGE_PATH := application

# Find all image sources
IMAGE_SOURCES := $(shell find $(IMAGE_PATH) -type f)

# Create the image tag from the commit date
IMAGE_TAG := $(shell git show --quiet --date=format:%Y.%m.%d --format=%cd)

# Check if the repository has unstaged changes
ifneq ($(shell git status --porcelain),)
    IMAGE_TAG := $(IMAGE_TAG)-dirty
endif

all: image

push: image
	git diff --quiet && \
	docker push $(IMAGE_NAME):$(IMAGE_TAG)

image: $(IMAGE_SOURCES)
	docker build $(IMAGE_PATH) -t $(IMAGE_NAME):$(IMAGE_TAG)$(IMAGE_STATUS)