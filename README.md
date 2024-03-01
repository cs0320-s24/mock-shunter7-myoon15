> **GETTING STARTED:** You should likely start with the `/mock` folder from your solution code for the mock gearup.

# Project Details
We implemented the front-end for a web application that parses CSV files. It uses a REPL input that recognizes commands for load_file (filepath), view, search (term) (column), and mode. View and search functionalities are only available after a CSV is loaded, and they both output an HTML table containing the elements of CSV. We implemented mode toggling between brief and verbose, where the entire history changes based on the mode.

# Design Choices
App is our top level class that changes what's being displayed, based on whether we're logged in. CommandInput handles the REPL input and command actions. We avoid a switch statement by splitting the command with a regex expression and using a generic runCommand function for modularity. This way, developers can add future commands without dealing with an if-else or switch chain. 
For history, we use a list of tuples where the first element is a string for command, and the second element is either a string or 2D string array that represents the output. By doing this, we can store the command and output so can display both in verbose mode. 

# Errors/Bugs
None that we know of

# Tests
We labeled each command as either "bcommand+i" or "vcommand+i," and outputs as either "boutput+i," "btable+i," "voutput+i", or "vtable+i," where i is the index of the command. By doing this, we can getByLabel for each specific output and test. Here are a list of tests we did:
- on page load, I see login form
- login using incorrect credentials
- login using correct credentials
- on page load, i dont see the input box until login
- entering an invalid command causes error and doesn't add to history
- entering an invalid command causes error and doesn't add to history
- loading a valid filepath
- loading with invalid number arguments
- viewing without loading
- viewing with incorrect arguments
- viewing after loading
- loading twice then view
- searching after loading
- searching before loading
- searching invalid search term
- searching invalid number of arguments
- test mode changes
- test load, view, search, mode, and history size increment
 
# How to
Log in using username: alex; password: alex. Use the command "load_file (filepath)" to load a CSV. Our supported filepaths are "normal," "malformed," "noHeaders," "empty," and "missing." You can then call "view" to see the CSV as an HTML table, and "search ma 2" to see mocked data for search.

# Collaboration
*(state all of your sources of collaboration past your project partner. Please refer to the course's collaboration policy for any further questions.)*
