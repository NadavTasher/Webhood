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
BUILD_PATH := build
BUNDLE_PATH := bundle
EXAMPLES_PATH := examples
RESOURCES_PATH := resources

TESTS_PATH := $(RESOURCES_PATH)/tests
SCRIPTS_PATH := $(RESOURCES_PATH)/scripts

BACKEND_PATH := $(IMAGE_PATH)/src/backend
FRONTEND_PATH := $(IMAGE_PATH)/src/frontend
ENTRYPOINT_PATH := $(IMAGE_PATH)/src/entrypoint.py

BUNDLE_BACKEND_PATH := $(BUNDLE_PATH)/application/src/backend
BUNDLE_FRONTEND_PATH := $(BUNDLE_PATH)/application/src/frontend

IMAGE_SOURCES := $(shell find $(IMAGE_PATH) -type f)

prerequisites:
	$(PYTHON) -m pip install jinja2 yapf

format: $(wildcard $(BACKEND_PATH)/*.py) $(ENTRYPOINT_PATH) $(wildcard $(EXAMPLES_PATH)/*/application/src/backend/*.py) $(wildcard $(SCRIPTS_PATH)/*.py) | prerequisites
	$(PYTHON) -m yapf -i $^ --style "{based_on_style: google, column_limit: 400, indent_width: 4}"

image: $(IMAGE_PATH)/Dockerfile-$(IMAGE_TAG) | format $(IMAGE_SOURCES)
	$(DOCKER) build $(IMAGE_PATH) -f $^ -t $(IMAGE_NAME)/$(IMAGE_TAG) -t $(IMAGE_NAME)/$(IMAGE_DATE_TAG) -t $(IMAGE_NAME)/$(IMAGE_LATEST_TAG)

build: $(BUILD_PATH)/test-page-headless.html $(BUILD_PATH)/index-headless.html image

clean:
	$(RM) -r $(IMAGE_PATH)/Dockerfile-* $(BUILD_PATH)

test: image
	$(DOCKER) run --rm -p 80:80 -p 443:443 -e DEBUG=1 -v $(abspath $(TESTS_PATH)/test-page.html):/application/frontend/index.html:ro $(IMAGE_NAME)/$(IMAGE_TAG)

test-bash: image
	$(DOCKER) run --rm -p 80:80 -p 443:443 -e DEBUG=1 -v $(abspath $(TESTS_PATH)/test-page.html):/application/frontend/index.html:ro -it $(IMAGE_NAME)/$(IMAGE_TAG) bash

test-image: image
	$(DOCKER) run --rm -p 80:80 -p 443:443 $(IMAGE_NAME)/$(IMAGE_TAG)

test-bundle: bundle
	$(DOCKER) compose --project-directory $(BUNDLE_PATH) up --build

bundle: image $(BUNDLE_BACKEND_PATH)/app.py $(BUNDLE_BACKEND_PATH)/worker.py $(BUNDLE_FRONTEND_PATH)/index.html $(BUNDLE_FRONTEND_PATH)/application/application.css $(BUNDLE_FRONTEND_PATH)/application/application.js

buildx: $(IMAGE_PATH)/Dockerfile-$(IMAGE_TAG) | format $(IMAGE_SOURCES)
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

$(IMAGE_PATH)/Dockerfile-$(IMAGE_TAG): $(IMAGE_PATH)/Dockerfile.template | format $(SCRIPTS_PATH)/create_dockerfile.py
	$(MKDIR) -p $(@D)
	$(PYTHON) $(SCRIPTS_PATH)/create_dockerfile.py --base-image $(BASE_IMAGE) < $^ > $@

$(BUILD_PATH)/index-headless.html: $(FRONTEND_PATH)/index.html | format $(IMAGE_SOURCES) $(SCRIPTS_PATH)/create_headless_page.py
	$(MKDIR) -p $(@D)
	$(PYTHON) $(SCRIPTS_PATH)/create_headless_page.py --base-directory $(FRONTEND_PATH) < $^ > $@

$(BUILD_PATH)/test-page-headless.html: $(TESTS_PATH)/test-page.html | format $(IMAGE_SOURCES) $(SCRIPTS_PATH)/create_headless_page.py
	$(MKDIR) -p $(@D)
	$(PYTHON) $(SCRIPTS_PATH)/create_headless_page.py --base-directory $(FRONTEND_PATH) < $^ > $@