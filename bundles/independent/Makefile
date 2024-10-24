# Change this to your image name
IMAGE_NAME := your/image

# Paths to sources
SOURCE_DIRECTORY := application
SOURCE_FILES := $(shell find $(SOURCE_DIRECTORY) -type f)

# Change this to your upstream branch name
UPSTREAM_BRANCH := master

ifeq ($(shell git rev-parse --abbrev-ref HEAD),$(UPSTREAM_BRANCH))
# We are on the upstream branch, create image tag from commit date.
IMAGE_TAG := $(shell git show --quiet --date=format:%Y.%m.%d --format=%cd)
else
# We are not on the upstream branch, make image tag reflect that.
IMAGE_TAG := develop
endif

.PHONY: all
all: image

ifneq ($(shell git status --porcelain),)
# The repository is dirty, deny pushes and mark image as dirty.
IMAGE_TAG := $(IMAGE_TAG)-dirty

.PHONY: push
push:
	@echo "There are unstaged changes in the repository, refusing push"
	@false
else
# The repository is clean, allow pushing images after building them.

.PHONY: push
push: image
	@docker push $(IMAGE_NAME):$(IMAGE_TAG)
endif

.PHONY: image
image: $(SOURCE_FILES)
	@docker build $(SOURCE_DIRECTORY) -t $(IMAGE_NAME):$(IMAGE_TAG)

.PHONY: develop
develop: image
	@docker compose up --build