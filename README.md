
# InstaBuild

## Getting Started

To get a feel for what this is all about (and once you've installed the  
[dependencies](#dependencies)) do  

    git clone git@github.com/gaye/instabuild.git
    npm install -g instabuild
    instabuild example/instabuild.json

Then open example/ in your text editor and try making some changes  
to the HTML, javascript, and css files while observing your browser.  
Also note that your changes are auto-deployed to  
`config["name"].instabuild.org` :).

### Dependencies

+ Node 0.8.x
+ rsync

## Contributing

### Running the test suite

    npm install -g mocha
    tools/test.sh

### TODO

+ Add support for languages whose compile targets are HTML, css, and javascript
+ Add support for watching dependencies of files specified in `watchList`
+ Extend commandline tool with build options
