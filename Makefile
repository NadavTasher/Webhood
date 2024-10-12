IMAGE_TAG ?= 3.8
IMAGE_NAME ?= webhood

IMAGE_DATE_TAG ?= $(IMAGE_TAG):$(shell date +%Y.%m.%d)
IMAGE_LATEST_TAG ?= $(IMAGE_TAG):latest

COPY ?= $(shell which cp)
MKDIR ?= $(shell which mkdir)
DOCKER ?= $(shell which docker)
PYTHON ?= $(shell which python3)

# Python virtual environment paths
VENV_PATH := .venv

# Python executable paths
PIP := $(VENV_PATH)/bin/pip
YAPF := $(VENV_PATH)/bin/yapf
MYPY := $(VENV_PATH)/bin/mypy
PYLINT := $(VENV_PATH)/bin/pylint
PYTHON := $(VENV_PATH)/bin/python

# All paths
IMAGE_PATH := image
BUNDLES_PATH := bundles
EXAMPLES_PATH := examples
RESOURCES_PATH := resources

# Additional resources
TESTS_PATH := $(RESOURCES_PATH)/tests
SCRIPTS_PATH := $(RESOURCES_PATH)/scripts

# Source paths
BACKEND_PATH := $(IMAGE_PATH)/src/backend
FRONTEND_PATH := $(IMAGE_PATH)/src/frontend
ENTRYPOINT_PATH := $(IMAGE_PATH)/src/entrypoint.py
REQUIREMENTS_PATH := $(IMAGE_PATH)/requirements.txt

# Bundle paths
HEADLESS_BUNDLE_PATH := $(BUNDLES_PATH)/headless
BUILDLESS_BUNDLE_PATH := $(BUNDLES_PATH)/buildless
INDEPENDENT_BUNDLE_PATH := $(BUNDLES_PATH)/independent

# Headless bundle source paths
HEADLESS_BUNDLE_INDEX_PATH := $(HEADLESS_BUNDLE_PATH)/index.html
HEADLESS_BUNDLE_TEST_PAGE_PATH := $(HEADLESS_BUNDLE_PATH)/test-page.html

# Buildless bundle source paths
BUILDLESS_BUNDLE_BACKEND_PATH := $(BUILDLESS_BUNDLE_PATH)/src/backend
BUILDLESS_BUNDLE_FRONTEND_PATH := $(BUILDLESS_BUNDLE_PATH)/src/frontend

# Independent bundle source paths
INDEPENDENT_BUNDLE_BACKEND_PATH := $(INDEPENDENT_BUNDLE_PATH)/application/src/backend
INDEPENDENT_BUNDLE_FRONTEND_PATH := $(INDEPENDENT_BUNDLE_PATH)/application/src/frontend

# All image sources
IMAGE_SOURCES := $(shell find $(IMAGE_PATH) -type f)

# All python sources
PYTHON_SOURCES := $(wildcard $(BACKEND_PATH)/*.py) $(wildcard $(BACKEND_PATH)/*/*.py) $(ENTRYPOINT_PATH) $(wildcard $(SCRIPTS_PATH)/*.py)

all: bundles image

# Linting and checks

checks: format lint typecheck

lint: $(PYLINT) $(PYTHON_SOURCES)
	@# Lint all of the sources
	$(PYLINT) -d C0301 -d C0114 -d C0115 -d C0116 $(PYTHON_SOURCES)

typecheck: $(MYPY) $(PYTHON_SOURCES)
	@# Typecheck all of the sources
	$(MYPY) --strict --explicit-package-bases --no-implicit-reexport $(PYTHON_SOURCES)

format: $(YAPF) $(PYTHON_SOURCES)
	@# Format the python sources using yapf
	$(YAPF) -i $(PYTHON_SOURCES) --style "{based_on_style: google, column_limit: 400, indent_width: 4}"

# Images

image: format $(IMAGE_SOURCES)
	@# Build the image
	$(DOCKER) build --build-arg PYTHON_VERSION=$(IMAGE_TAG) $(IMAGE_PATH) -t $(IMAGE_NAME)/$(IMAGE_TAG) -t $(IMAGE_NAME)/$(IMAGE_DATE_TAG) -t $(IMAGE_NAME)/$(IMAGE_LATEST_TAG)

buildx: format $(IMAGE_SOURCES)
	@# Create the build context
	$(DOCKER) buildx create --use

	@# Build the image
	$(DOCKER) buildx build --build-arg PYTHON_VERSION=$(IMAGE_TAG) $(IMAGE_PATH) --push --platform linux/386,linux/amd64,linux/arm64/v8 -t $(IMAGE_NAME)/$(IMAGE_DATE_TAG) -t $(IMAGE_NAME)/$(IMAGE_LATEST_TAG)

# Bundles

bundles: headless buildless independent
headless: $(HEADLESS_BUNDLE_INDEX_PATH) $(HEADLESS_BUNDLE_TEST_PAGE_PATH)
buildless: $(BUILDLESS_BUNDLE_BACKEND_PATH)/app.py $(BUILDLESS_BUNDLE_BACKEND_PATH)/worker.py $(BUILDLESS_BUNDLE_FRONTEND_PATH)/index.html $(BUILDLESS_BUNDLE_FRONTEND_PATH)/application/application.css $(BUILDLESS_BUNDLE_FRONTEND_PATH)/application/application.js
independent: $(INDEPENDENT_BUNDLE_BACKEND_PATH)/app.py $(INDEPENDENT_BUNDLE_BACKEND_PATH)/worker.py $(INDEPENDENT_BUNDLE_FRONTEND_PATH)/index.html $(INDEPENDENT_BUNDLE_FRONTEND_PATH)/application/application.css $(INDEPENDENT_BUNDLE_FRONTEND_PATH)/application/application.js

# Local prerequisites

$(VENV_PATH): $(REQUIREMENTS_PATH)
	@# Create a new virtual environment
	python3 -m venv $(VENV_PATH)

	@# Install some dependencies
	$(PIP) install -r $(REQUIREMENTS_PATH) jinja2 yapf mypy pylint

$(YAPF): $(VENV_PATH)
$(MYPY): $(VENV_PATH)
$(PYLINT): $(VENV_PATH)
$(PYTHON): $(VENV_PATH)

# Targets to make

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

# Tests

test: image
	$(DOCKER) run --rm -p 80:80 -p 443:443 -e DEBUG=1 -e REDIS=$(REDIS) -v $(abspath $(TESTS_PATH)/test-page.html):/application/frontend/index.html:ro -v /tmp/test:/opt $(IMAGE_NAME)/$(IMAGE_TAG)

test-bash: image
	$(DOCKER) run --rm -p 80:80 -p 443:443 -e DEBUG=1 -e REDIS=$(REDIS) -v $(abspath $(TESTS_PATH)/test-page.html):/application/frontend/index.html:ro -v /tmp/test:/opt -it $(IMAGE_NAME)/$(IMAGE_TAG) bash

test-image: image
	$(DOCKER) run --rm -p 80:80 -p 443:443 -e REDIS=$(REDIS) -v /tmp/test:/opt $(IMAGE_NAME)/$(IMAGE_TAG)

test-buildless: buildless
	$(DOCKER) compose --project-directory $(BUILDLESS_BUNDLE_PATH) up

test-independent: independent
	$(DOCKER) compose --project-directory $(INDEPENDENT_BUNDLE_PATH) up --build

test-independent-build: independent
	$(MAKE) -C $(INDEPENDENT_BUNDLE_PATH)

# Cleanups

clean:
	$(RM) -r $(VENV_PATH) $(IMAGE_PATH)/Dockerfile-*