
# InstaBuild

## Getting Started

To get a feel for what this is all about (and once you've installed the  
[dependencies](#dependencies)) do  

    npm install -g instabuild@0.3.3
    instabuild create hello
    cd hello
    instabuild serve instabuild.json

Then open  

+ `hello/` in your text editor
+ `localhost:3000` in your browser
+ `hello.instabuild.org` in your browser

and make some changes to the HTML, javascript, and css. You'll notice  
that instabuild automatically refreshes the page on the local server  
and deploys the new code to the remote server when you make changes :)

### Dependencies

+ Node 0.8.x
+ rsync

## Contributing

### Running the test suite

    npm install -g mocha
    tools/test.sh
