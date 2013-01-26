
# InstaBuild

## Getting Started

To get a feel for what this is all about, do  

    git clone git@github.com/gaye/instabuild.git
    npm install -g instabuild
    instabuild example/instabuild.json  # Open localhost:3000 in your browser

Then open example/ in your text editor and try making some changes  
to the HTML, javascript, and css files while observing your browser.

## Contributing

### Running the test suite

`tools/test.sh`

### TODO

+ Add options to `instabuild.json` to allow users to configure what the  
instaserver does when it gets a `change` event from `FSReporter`.
+ Add build and deploy options
+ Add support for languages whose compile targets are HTML, css, and javascript
+ Add support for watching dependencies of files specified in `watchList`
+ Build commandline tool for users to deploy their instabuild apps to the cloud
