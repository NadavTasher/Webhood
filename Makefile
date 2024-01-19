BASE_IMAGE ?= python:3.8.18-slim-bullseye

IMAGE_TAG ?= 3.8
IMAGE_NAME ?= webhood

IMAGE_DATE_TAG ?= $(IMAGE_TAG):$(shell date +%Y.%m.%d)
IMAGE_LATEST_TAG ?= $(IMAGE_TAG):latest

COPY ?= $(shell which cp)
MKDIR ?= $(shell which mkdir)
PYTHON ?= $(shell which python3)
DOCKER ?= $(shell which docker)

IMAGE_PATH := image
BUNDLE_PATH := bundle

BACKEND_PATH := $(IMAGE_PATH)/src/backend
FRONTEND_PATH := $(IMAGE_PATH)/src/frontend

BUNDLE_BACKEND_PATH := $(BUNDLE_PATH)/application/src/backend
BUNDLE_FRONTEND_PATH := $(BUNDLE_PATH)/application/src/frontend

IMAGE_SOURCES := $(shell find $(IMAGE_PATH) -type f)

prerequisites:
	$(PYTHON) -m pip install jinja2-cli yapf

format: $(wildcard $(BACKEND_PATH)/*.py) | prerequisites
	$(PYTHON) -m yapf -i $^ --style "{based_on_style: google, column_limit: 400, indent_width: 4}"

image: $(IMAGE_PATH)/Dockerfile | format $(IMAGE_SOURCES)
	$(DOCKER) build $(IMAGE_PATH) -f $^ -t $(IMAGE_NAME)/$(IMAGE_TAG) -t $(IMAGE_NAME)/$(IMAGE_DATE_TAG) -t $(IMAGE_NAME)/$(IMAGE_LATEST_TAG)

clean:
	$(RM) $(IMAGE_PATH)/Dockerfile

test: image
	$(DOCKER) run --rm -p 80:80 -p 443:443 $(IMAGE_NAME)/$(IMAGE_TAG)

test-bash: image
	$(DOCKER) run --rm -p 80:80 -p 443:443 -it $(IMAGE_NAME)/$(IMAGE_TAG) bash

test-bundle: bundle
	$(DOCKER) compose --project-directory $(BUNDLE_PATH) up --build

bundle: image $(BUNDLE_BACKEND_PATH)/app.py $(BUNDLE_BACKEND_PATH)/worker.py $(BUNDLE_FRONTEND_PATH)/index.html $(BUNDLE_FRONTEND_PATH)/application/application.css $(BUNDLE_FRONTEND_PATH)/application/application.js

buildx: $(IMAGE_PATH)/Dockerfile | format $(IMAGE_SOURCES)
	$(DOCKER) buildx create --use
	$(DOCKER) buildx build $(IMAGE_PATH) --push --platform linux/386,linux/amd64,linux/arm/v5,linux/arm/v7,linux/arm64/v8 -f $^ -t $(IMAGE_NAME)/$(IMAGE_DATE_TAG) -t $(IMAGE_NAME)/$(IMAGE_LATEST_TAG)

$(BUNDLE_BACKEND_PATH)/%.py: $(BACKEND_PATH)/%.py
	$(MKDIR) -p $(@D)
	$(COPY) $^ $@

$(BUNDLE_FRONTEND_PATH)/index.html: $(FRONTEND_PATH)/index.html
	$(MKDIR) -p $(@D)
	$(COPY) $^ $@

$(BUNDLE_FRONTEND_PATH)/application/application.%: $(FRONTEND_PATH)/application/application.%
	$(MKDIR) -p $(@D)
	$(COPY) $^ $@

$(IMAGE_PATH)/Dockerfile: $(IMAGE_PATH)/Dockerfile.template | prerequisites
	$(MKDIR) -p $(@D)
	$(PYTHON) -m jinja2cli.cli $^ -DBASE_IMAGE=$(BASE_IMAGE) > $@