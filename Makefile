# Python version for builds
PYTHON_VERSION ?= 3.8

# Generate image name from python version
IMAGE_NAME ?= webhood/$(PYTHON_VERSION)

# Generate image tag from commit date
IMAGE_TAG ?= $(shell git show --quiet --date=format:%Y.%m.%d --format=%cd)

# Python virtual environment path
VENV_PATH := $(abspath .venv)

# Python executable paths
PIP := $(VENV_PATH)/bin/pip
YAPF := $(VENV_PATH)/bin/yapf
MYPY := $(VENV_PATH)/bin/mypy
PYLINT := $(VENV_PATH)/bin/pylint
PYTHON := $(VENV_PATH)/bin/python

# All paths
IMAGE_PATH := $(abspath image)
BUNDLES_PATH := $(abspath bundles)
EXAMPLES_PATH := $(abspath examples)
RESOURCES_PATH := $(abspath resources)

# Additional resources
EXAMPLE_PAGE_PATH := $(RESOURCES_PATH)/headless/example-page.html
PAGE_RENDERER_PATH := $(RESOURCES_PATH)/headless/page-renderer.py

# Source paths
BACKEND_PATH := $(IMAGE_PATH)/src/backend
FRONTEND_PATH := $(IMAGE_PATH)/src/frontend

# Path to image requirements
REQUIREMENTS_PATH := $(IMAGE_PATH)/resources/requirements.txt

# Bundle paths
HEADLESS_BUNDLE_PATH := $(BUNDLES_PATH)/headless
BUILDLESS_BUNDLE_PATH := $(BUNDLES_PATH)/buildless
INDEPENDENT_BUNDLE_PATH := $(BUNDLES_PATH)/independent

# Headless bundle source paths
HEADLESS_BUNDLE_EMPTY_PAGE_PATH := $(HEADLESS_BUNDLE_PATH)/empty-page.html
HEADLESS_BUNDLE_EXAMPLE_PAGE_PATH := $(HEADLESS_BUNDLE_PATH)/example-page.html

# Buildless bundle source paths
BUILDLESS_BUNDLE_BACKEND_PATH := $(BUILDLESS_BUNDLE_PATH)/src/backend
BUILDLESS_BUNDLE_FRONTEND_PATH := $(BUILDLESS_BUNDLE_PATH)/src/frontend

# Independent bundle source paths
INDEPENDENT_BUNDLE_BACKEND_PATH := $(INDEPENDENT_BUNDLE_PATH)/application/src/backend
INDEPENDENT_BUNDLE_FRONTEND_PATH := $(INDEPENDENT_BUNDLE_PATH)/application/src/frontend

# All image sources
IMAGE_SOURCES := $(shell find $(IMAGE_PATH) -type f)

# All python sources
PYTHON_SOURCES := $(PAGE_RENDERER_PATH) $(shell find $(IMAGE_PATH) -type f -name '*.py')

# Default test values
DEBUG ?= 0
REDIS ?= redis://$(shell hostname)

.PHONY: all
all: checks bundles image

# Linting and checks

.PHONY: checks
checks: format lint typecheck

.PHONY: lint
lint: $(PYLINT)
	@# Lint all of the sources
	cd $(BACKEND_PATH); $(PYLINT) -d C0103 -d C0301 -d C0114 -d C0115 -d C0116 -d W0401 $(PYTHON_SOURCES)

.PHONY: typecheck
typecheck: $(MYPY)
	@# Typecheck all of the sources
	cd $(BACKEND_PATH); $(MYPY) --cache-dir=/dev/null --explicit-package-bases --no-implicit-reexport $(PYTHON_SOURCES)

.PHONY: format
format: $(YAPF)
	@# Format the python sources using yapf
	$(YAPF) --in-place --recursive --style "{based_on_style: google, column_limit: 400, indent_width: 4}" $(PYTHON_SOURCES)

# Images

.PHONY: image
image: format
	@# Build the image
	docker buildx build --build-arg PYTHON_VERSION=$(PYTHON_VERSION) $(IMAGE_PATH) --load --tag $(IMAGE_NAME):latest

.PHONY: buildx
buildx: format
	@# Create the build context
	docker buildx create --use

	@# Build the image
	docker buildx build --build-arg PYTHON_VERSION=$(PYTHON_VERSION) $(IMAGE_PATH) --platform linux/386,linux/amd64,linux/arm64/v8 --push --tag $(IMAGE_NAME):latest --tag $(IMAGE_NAME):$(IMAGE_TAG)

# Bundles

.PHONY: bundles
bundles: headless buildless independent

.PHONY: headless
headless: $(HEADLESS_BUNDLE_EMPTY_PAGE_PATH) $(HEADLESS_BUNDLE_EXAMPLE_PAGE_PATH)

.PHONY: buildless
buildless: $(BUILDLESS_BUNDLE_BACKEND_PATH)/app.py $(BUILDLESS_BUNDLE_BACKEND_PATH)/worker.py $(BUILDLESS_BUNDLE_FRONTEND_PATH)/index.html $(BUILDLESS_BUNDLE_FRONTEND_PATH)/application/application.css $(BUILDLESS_BUNDLE_FRONTEND_PATH)/application/application.js

.PHONY: independent
independent: $(INDEPENDENT_BUNDLE_BACKEND_PATH)/app.py $(INDEPENDENT_BUNDLE_BACKEND_PATH)/worker.py $(INDEPENDENT_BUNDLE_FRONTEND_PATH)/index.html $(INDEPENDENT_BUNDLE_FRONTEND_PATH)/application/application.css $(INDEPENDENT_BUNDLE_FRONTEND_PATH)/application/application.js

# Local prerequisites

$(VENV_PATH): $(REQUIREMENTS_PATH)
	@# Remove the old virtual environment
	$(RM) -r $(VENV_PATH)
	
	@# Create a new virtual environment
	python3 -m venv $(VENV_PATH)

	@# Install some dependencies
	$(PIP) install -r $(REQUIREMENTS_PATH) jinja2 yapf mypy pylint munch-stubs

$(YAPF): $(VENV_PATH)
$(MYPY): $(VENV_PATH)
$(PYLINT): $(VENV_PATH)
$(PYTHON): $(VENV_PATH)

# Targets to make

$(INDEPENDENT_BUNDLE_BACKEND_PATH)/%.py: $(BACKEND_PATH)/%.py
	mkdir -p $(@D)
	cp $^ $@

$(INDEPENDENT_BUNDLE_FRONTEND_PATH)/index.html: $(FRONTEND_PATH)/index.html
	mkdir -p $(@D)
	cp $^ $@

$(INDEPENDENT_BUNDLE_FRONTEND_PATH)/application/application.%: $(FRONTEND_PATH)/application/application.%
	mkdir -p $(@D)
	cp $^ $@

$(BUILDLESS_BUNDLE_BACKEND_PATH)/%.py: $(BACKEND_PATH)/%.py
	mkdir -p $(@D)
	cp $^ $@

$(BUILDLESS_BUNDLE_FRONTEND_PATH)/index.html: $(FRONTEND_PATH)/index.html
	mkdir -p $(@D)
	cp $^ $@

$(BUILDLESS_BUNDLE_FRONTEND_PATH)/application/application.%: $(FRONTEND_PATH)/application/application.%
	mkdir -p $(@D)
	cp $^ $@

$(HEADLESS_BUNDLE_EMPTY_PAGE_PATH): $(FRONTEND_PATH)/index.html $(PAGE_RENDERER_PATH) $(IMAGE_SOURCES)
	mkdir -p $(@D)
	$(PYTHON) $(PAGE_RENDERER_PATH) --base-directory $(FRONTEND_PATH) < $(FRONTEND_PATH)/index.html > $@

$(HEADLESS_BUNDLE_EXAMPLE_PAGE_PATH): $(EXAMPLE_PAGE_PATH) $(PAGE_RENDERER_PATH) $(IMAGE_SOURCES)
	mkdir -p $(@D)
	$(PYTHON) $(PAGE_RENDERER_PATH) --base-directory $(FRONTEND_PATH) < $(EXAMPLE_PAGE_PATH) > $@

# Tests

.PHONY: test
test: image
	docker run --rm -it -p 80:8080 -p 443:8443 -e DEBUG=$(DEBUG) -e REDIS=$(REDIS) -v $(EXAMPLE_PAGE_PATH):/application/frontend/index.html:ro $(IMAGE_NAME):latest $(COMMAND)

.PHONY: test-debug
test-debug: image
	$(MAKE) test DEBUG=1

.PHONY: test-bash
test-bash:
	$(MAKE) test COMMAND=bash

.PHONY: test-ipython
test-ipython:
	$(MAKE) test COMMAND=ipython

.PHONY: test-buildless-bundle
test-buildless-bundle: buildless
	$(MAKE) -C $(BUILDLESS_BUNDLE_PATH) develop

.PHONY: test-independent-bundle
test-independent-bundle: independent
	$(MAKE) -C $(INDEPENDENT_BUNDLE_PATH) develop

.PHONY: test-independent-makefile
test-independent-makefile: independent
	$(MAKE) -C $(INDEPENDENT_BUNDLE_PATH) image

# Cleanups

.PHONY: clean
clean:
	$(RM) -r $(VENV_PATH)
