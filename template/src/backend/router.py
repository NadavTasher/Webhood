from flask import Flask, request, redirect, render_template, make_response, send_from_directory

# Initialize the application
app = Flask(__name__)

def arguments(**kwargs):

	# Create wrapper for route that will get all arguments from request
	pass