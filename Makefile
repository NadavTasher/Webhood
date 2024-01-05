BASE_TAG ?= 3.8.18-slim-bullseye
IMAGE_TAG ?= 3.8

PYTHON ?= $(shell which python3)
DOCKER ?= $(shell which docker)

TEMPLATE_PATH := template

BACKEND_PATH := $(TEMPLATE_PATH)/src/backend
BACKEND_SOURCES := $(wildcard $(BACKEND_PATH)/*.py)

prerequisites:
	$(PYTHON) -m pip install jinja2-cli yapf

format: $(BACKEND_SOURCES) | prerequisites
	$(PYTHON) -m yapf -i $^ --style "{based_on_style: google, column_limit: 400, indent_width: 4}"

image: $(TEMPLATE_PATH)/Dockerfile | $(BACKEND_SOURCES) $(FRONTEND_SOURCES)
	$(DOCKER) build $(TEMPLATE_PATH) -f $^ -t template:$(IMAGE_TAG)

clean:
	$(RM) $(TEMPLATE_PATH)/Dockerfile

test: image
	$(DOCKER) run --rm -p 80:80 template:$(IMAGE_TAG)

$(TEMPLATE_PATH)/Dockerfile: $(TEMPLATE_PATH)/Dockerfile.template | prerequisites
	$(PYTHON) -m jinja2cli.cli $^ -DTAG=$(BASE_TAG) > $@