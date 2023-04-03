# cli-tool

## Features
 * Parses arguments through mini
 * 

## Installation

## How to use
```
const { CliTool } = require("CliTool");

const cli = new CliTool("Description of command/script").parse(
    [
        {
            type: "string",
            description: "Description for first argument" 
        }
    ]
    {
        stringFlag: {
            type: "string",

        }
    }
)
```

## Configuration options

The flags can be configured as following:
 * type: 
 * alias: The abbrivation of the flag. This is usally only one letter and will be used with a single dash, ex -v for verbose.
 * description: This contain the text which will be shown in the help command. 
 * default: Containt the default value which will be written in the result, if the flag is missing.   
 * required: 

The arguments can be configured as following:
 * type: ["string", ""]
 * description: This will be the text which is shown in help.
 * default: The default value which be set if the argument is missing
 * required: ["boolean"] 



## Test
CliTool use TAP protocol for testing. For complete test install development dependencies and 

## Changelog

