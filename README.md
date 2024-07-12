# Webhood
![Builds](https://github.com/NadavTasher/Webhood/actions/workflows/build.yml/badge.svg)

## What is Webhood?
Webhood is a simple to use, full-stack web-application framework for creating small to mid-size projects.

It does not require any external dependencies for simple projects, and can be easily extended for more specialized applications.

## Getting started
Creating your own application using Webhood couldn't be easier.

Get yourself a copy of the repository. You can [clone it](https://github.com/NadavTasher/Webhood), [fork it](https://github.com/NadavTasher/Webhood/fork) or [download it directly](https://github.com/NadavTasher/Webhood/archive/refs/heads/master.zip).

Choose the bundle thats right for you:
1. [Headless](https://github.com/NadavTasher/Webhood/tree/master/bundles/headless) - if you only mean to use Webhood's frontend utilities **or** need a self-contained no-external-resources boilerplate, this one is for you.
2. [Buildless](https://github.com/NadavTasher/Webhood/tree/master/bundles/buildless) - if you do not plan on doing any build changes (like adding more libraries) and are not planning on a complex backend API, this bundle leverages the use of `docker`'s read-only bind mounts to secure your sources in the container.
3. [Independent](https://github.com/NadavTasher/Webhood/tree/master/bundles/independent) - this bundle is the All-Star bundle. It allows you to tinker, extend, customize and build your application the way you want.

### Step-by-step guide for creating a new application
```bash
# Clone webhood locally
git clone git@github.com:NadavTasher/Webhood.git Webhood

# Create a new 
```

## Tech stack
Webhood is based on popular projects and strives to keep the application architecture simple efficient.

1. Web server duties are handled by [NGINX](https://nginx.org/). NGINX serves as a static file server and as a reverse-proxy for the backend API. NGINX also handles TLS.
2. Python backend is powered by [Starlette](https://www.starlette.io/) - an open-source WSGI framework that is the basis for many open-source projects. In our case, Starlette is extended by the [router.py](https://github.com/NadavTasher/Webhood/blob/master/image/src/backend/router.py) file.
3. Frontend duties are handled by a couple of utility JavaScript and CSS files residing in [src/frontend](https://github.com/NadavTasher/Webhood/tree/master/image/src/frontend). You can see an example of the frontend capabilities in the [Headless Test Page](https://github.com/NadavTasher/Webhood/blob/master/bundles/headless/test-page.html).

## Features

