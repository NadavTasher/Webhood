import re
import os
import sys
import base64
import argparse


def substitute_with_file(content, base_path, file_path, content_type):
    # Open the file for reading and read contents
    with open(os.path.join(base_path, file_path.lstrip("/")), "rb") as file:
        data = file.read()

    # Return the content with the new path
    return content.replace(file_path, f'data:{content_type};base64,{base64.b64encode(data).decode()}')


def main():
    # Create argument parser
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-directory", action="store", required=True, help="Directory to use for rendering the template")

    # Parse the arguments
    arguments = parser.parse_args()

    # Read the stdin
    template = sys.stdin.read()

    # Replace icons
    for icon in re.findall(r'<link rel=".*icon" href="(.*)".*/>', template):
        template = substitute_with_file(template, arguments.base_directory, icon, "image/png")

    # Replace scripts
    for script in re.findall(r'<script .*src="(.*)".*></script>', template):
        template = substitute_with_file(template, arguments.base_directory, script, "text/javascript")

    # Replace stylesheets
    for stylesheet in re.findall(r'<link rel="stylesheet" href="(.*)".*/>', template):
        template = substitute_with_file(template, arguments.base_directory, stylesheet, "text/css")

    # Write the dockerfile to stdout
    sys.stdout.write(template)


if __name__ == "__main__":
    main()
