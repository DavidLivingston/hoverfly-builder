import path from 'path';
import arg from 'arg'
import {
    processFiles,deReferFiles,validateSchema
} from './main'

function parseArgs(rawArgs) {
    const args = arg({
        '--compile': Boolean,
        '--validate': Boolean,
        '--minify' :Boolean,
        '--schema':String,
        '--outputDir':String,
        //  aliases
        '-v':'--validate',
        '-c':'--compile',
        '-m':'--minify',
        '-s':'--schema',
        '-o': '--outputDir'
    }, {
        argv: rawArgs.slice(2)
    });
    return {
        validate: args['--validate'] || false,
        compile: args['--compile'] || false,
        minify: args['--minify'] || false,
        schema: args['--schema'] || '../workspace/schema/hoverfly-simulation-schema.json',
        outputDir : args['--outputDir'] || '../../workspace/build/',
        fileList: args._ 
    };
}


export function cli(args) {

    const optionsReceived = parseArgs(args);

    
    //Throw error if filename is not present in the parameter
      if (!Array.isArray(optionsReceived.fileList) || !optionsReceived.fileList.length) {
          console.error("Atleast one JSON file is must to build the project !");
          process.exit(1);
      }
    
      if(optionsReceived.compile){
       processFiles(optionsReceived);
      }

}
