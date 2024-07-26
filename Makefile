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
BUNDLES_PATH := bundles
EXAMPLES_PATH := examples
RESOURCES_PATH := resources

TESTS_PATH := $(RESOURCES_PATH)/tests
SCRIPTS_PATH := $(RESOURCES_PATH)/scripts

BACKEND_PATH := $(IMAGE_PATH)/src/backend
FRONTEND_PATH := $(IMAGE_PATH)/src/frontend
ENTRYPOINT_PATH := $(IMAGE_PATH)/src/entrypoint.py

HEADLESS_BUNDLE_PATH := $(BUNDLES_PATH)/headless
BUILDLESS_BUNDLE_PATH := $(BUNDLES_PATH)/buildless
INDEPENDENT_BUNDLE_PATH := $(BUNDLES_PATH)/independent

HEADLESS_BUNDLE_INDEX_PATH := $(HEADLESS_BUNDLE_PATH)/index.html
HEADLESS_BUNDLE_TEST_PAGE_PATH := $(HEADLESS_BUNDLE_PATH)/test-page.html

BUILDLESS_BUNDLE_BACKEND_PATH := $(BUILDLESS_BUNDLE_PATH)/src/backend
BUILDLESS_BUNDLE_FRONTEND_PATH := $(BUILDLESS_BUNDLE_PATH)/src/frontend

INDEPENDENT_BUNDLE_BACKEND_PATH := $(INDEPENDENT_BUNDLE_PATH)/application/src/backend
INDEPENDENT_BUNDLE_FRONTEND_PATH := $(INDEPENDENT_BUNDLE_PATH)/application/src/frontend

IMAGE_SOURCES := $(shell find $(IMAGE_PATH) -type f)
PYTHON_SOURCES := $(wildcard $(BACKEND_PATH)/*.py) $(wildcard $(BACKEND_PATH)/*/*.py) $(ENTRYPOINT_PATH) $(wildcard $(EXAMPLES_PATH)/*/application/src/backend/*.py) $(wildcard $(SCRIPTS_PATH)/*.py)

all: bundles image

prerequisites:
	$(PYTHON) -m pip install jinja2 yapf

format: prerequisites $(PYTHON_SOURCES)
	$(PYTHON) -m yapf -i $(PYTHON_SOURCES) --style "{based_on_style: google, column_limit: 400, indent_width: 4}"

$(IMAGE_PATH)/Dockerfile-$(IMAGE_TAG): $(SCRIPTS_PATH)/create_dockerfile.py $(IMAGE_PATH)/Dockerfile.template
	$(MKDIR) -p $(@D)
	$(PYTHON) $(SCRIPTS_PATH)/create_dockerfile.py --python-version $(IMAGE_TAG) < $(IMAGE_PATH)/Dockerfile.template > $@

image: format $(IMAGE_PATH)/Dockerfile-$(IMAGE_TAG) $(IMAGE_SOURCES)
	$(DOCKER) build $(IMAGE_PATH) -f $(IMAGE_PATH)/Dockerfile-$(IMAGE_TAG) -t $(IMAGE_NAME)/$(IMAGE_TAG) -t $(IMAGE_NAME)/$(IMAGE_DATE_TAG) -t $(IMAGE_NAME)/$(IMAGE_LATEST_TAG)

buildx: format $(IMAGE_PATH)/Dockerfile-$(IMAGE_TAG) $(IMAGE_SOURCES)
	$(DOCKER) buildx create --use
	$(DOCKER) buildx build $(IMAGE_PATH) --push --platform linux/386,linux/amd64,linux/arm64/v8 -f $(IMAGE_PATH)/Dockerfile-$(IMAGE_TAG) -t $(IMAGE_NAME)/$(IMAGE_DATE_TAG) -t $(IMAGE_NAME)/$(IMAGE_LATEST_TAG)
	$(DOCKER) buildx rm --all-inactive

clean:
	$(RM) $(IMAGE_PATH)/Dockerfile-*

bundles: headless buildless independent

headless: $(HEADLESS_BUNDLE_INDEX_PATH) $(HEADLESS_BUNDLE_TEST_PAGE_PATH)

buildless: $(BUILDLESS_BUNDLE_BACKEND_PATH)/app.py $(BUILDLESS_BUNDLE_BACKEND_PATH)/worker.py $(BUILDLESS_BUNDLE_FRONTEND_PATH)/index.html $(BUILDLESS_BUNDLE_FRONTEND_PATH)/application/application.css $(BUILDLESS_BUNDLE_FRONTEND_PATH)/application/application.js

independent: $(INDEPENDENT_BUNDLE_BACKEND_PATH)/app.py $(INDEPENDENT_BUNDLE_BACKEND_PATH)/worker.py $(INDEPENDENT_BUNDLE_FRONTEND_PATH)/index.html $(INDEPENDENT_BUNDLE_FRONTEND_PATH)/application/application.css $(INDEPENDENT_BUNDLE_FRONTEND_PATH)/application/application.js

$(INDEPENDENT_BUNDLE_BACKEND_PATH)/%.py: $(BACKEND_PATH)/%.py
	$(MKDIR) -p $(@D)
	$(COPY) $^ $@

$(INDEPENDENT_BUNDLE_FRONTEND_PATH)/index.html: $(FRONTEND_PATH)/index.html
	$(MKDIR) -p $(@D)
	$(COPY) $^ $@

$(INDEPENDENT_BUNDLE_FRONTEND_PATH)/application/application.%: $(FRONTEND_PATH)/application/application.%
	$(MKDIR) -p $(@D)
	$(COPY) $^ $@

$(BUILDLESS_BUNDLE_BACKEND_PATH)/%.py: $(BACKEND_PATH)/%.py
	$(MKDIR) -p $(@D)
	$(COPY) $^ $@

$(BUILDLESS_BUNDLE_FRONTEND_PATH)/index.html: $(FRONTEND_PATH)/index.html
	$(MKDIR) -p $(@D)
	$(COPY) $^ $@

$(BUILDLESS_BUNDLE_FRONTEND_PATH)/application/application.%: $(FRONTEND_PATH)/application/application.%
	$(MKDIR) -p $(@D)
	$(COPY) $^ $@

$(HEADLESS_BUNDLE_INDEX_PATH): $(FRONTEND_PATH)/index.html $(SCRIPTS_PATH)/create_headless_page.py $(IMAGE_SOURCES)
	$(MKDIR) -p $(@D)
	$(PYTHON) $(SCRIPTS_PATH)/create_headless_page.py --base-directory $(FRONTEND_PATH) < $(FRONTEND_PATH)/index.html > $@

$(HEADLESS_BUNDLE_TEST_PAGE_PATH): $(TESTS_PATH)/test-page.html $(SCRIPTS_PATH)/create_headless_page.py $(IMAGE_SOURCES)
	$(MKDIR) -p $(@D)
	$(PYTHON) $(SCRIPTS_PATH)/create_headless_page.py --base-directory $(FRONTEND_PATH) < $(TESTS_PATH)/test-page.html > $@

test: image
	$(DOCKER) run --rm -p 80:80 -p 443:443 -e DEBUG=1 -v $(abspath $(TESTS_PATH)/test-page.html):/application/frontend/index.html:ro $(IMAGE_NAME)/$(IMAGE_TAG)

test-bash: image
	$(DOCKER) run --rm -p 80:80 -p 443:443 -e DEBUG=1 -v $(abspath $(TESTS_PATH)/test-page.html):/application/frontend/index.html:ro -it $(IMAGE_NAME)/$(IMAGE_TAG) bash

test-image: image
	$(DOCKER) run --rm -p 80:80 -p 443:443 $(IMAGE_NAME)/$(IMAGE_TAG)

test-buildless: buildless
	$(DOCKER) compose --project-directory $(BUILDLESS_BUNDLE_PATH) up

test-independent: independent
	$(DOCKER) compose --project-directory $(INDEPENDENT_BUNDLE_PATH) up --build