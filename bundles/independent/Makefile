# Change this to your image name
IMAGE_NAME := your/image

# Path to your sources
IMAGE_PATH := application

# Create the image tag from the commit date
IMAGE_TAG := $(shell git show --quiet --date=format:%Y.%m.%d --format=%cd)

# Create the image status from the working tree status
IMAGE_STATUS := $(shell git diff --quiet || echo "-dirty")

# Find all image sources
IMAGE_SOURCES := $(shell find $(IMAGE_PATH) -type f)

all: image

push: image
	git diff --quiet && \
	docker push $(IMAGE_NAME):$(IMAGE_TAG)

image: $(IMAGE_SOURCES)
	docker build $(IMAGE_PATH) -t $(IMAGE_NAME):$(IMAGE_TAG)$(IMAGE_STATUS)