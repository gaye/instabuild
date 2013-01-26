#!/usr/bin/env bash

# TODO(gareth): What sets "cb" in the global namespace?
mocha --globals cb -R spec
