import sys
import jinja2
import argparse


def main():
    # Create argument parser
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-image", action="store", required=True, help="Base image to use for creating the Dockerfile")

    # Parse the arguments
    arguments = parser.parse_args()

    # Read the stdin
    template = sys.stdin.read()

    # Create the jinja template
    jinja_template = jinja2.Template(template)

    # Render the template
    dockerfile = jinja_template.render({"BASE_IMAGE": arguments.base_image})

    # Write the dockerfile to stdout
    sys.stdout.write(dockerfile)


if __name__ == "__main__":
    main()
