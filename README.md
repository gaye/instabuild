
# InstaBuild

## Getting Started

To get a feel for what this is all about (and once you've installed the  
[dependencies](#dependencies)) do  

    npm install -g instabuild
    git clone git@github.com/instabuild/instabuild.git
    cd instabuild
    instabuild example/instabuild.json

Then open  

+ `example/` in your text editor
+ `localhost:3000` in your browser
+ `<config["name"]>.instabuild.org` in your browser

and make some changes to the HTML, javascript, and css. You'll notice  
that instabuild automatically refreshes the page on the local server  
when you make changes and deploys the new code to the remote server :)

### Dependencies

+ Node 0.8.x
+ rsync

## Contributing

### Running the test suite

    npm install -g mocha
    tools/test.sh
