import glob from 'glob'
import $RefParser from 'json-schema-ref-parser';
import fs from 'fs'
import JSONFormatter from 'json-fmt'
import Ajv from 'ajv'
import path from 'path'

export function processFiles(options){
    
    options.fileList.forEach(filePath =>{
        deReferFiles(filePath, options, validateSchema);
    });
}
export async function getFileList(pathExpression) {
    console.log('Patterns is : ' + pathExpression);
    glob(pathExpression, {
        cwd: true
    }, (er, files) => {
        if(er){
            console.error(er)
        }else{
            return files;
        }
    });

}

export async function deReferFiles(filePath, option, callback) {
    // read file and derefer 
    // let fmt = new JSONFormatter(JSONFormatter.MINI)
    var targetFileName = path.basename(filePath);
    var drefObj = await $RefParser.dereference(filePath);
    var jsonString = JSON.stringify(drefObj);
    const buildPath = path.resolve(
        new URL(import.meta.url).pathname,
        option.outputDir,
        targetFileName
      );
    fs.writeFile(
        buildPath, 
        jsonString,
        { flag: 'wx' },
        (err)=>{
           if (err) { 
                console.error(err);
           }
        });

    if(option.validate){
        callback(option, drefObj)
    }
    // initialize the schema validators ajv
    // const ajv = new Ajv({ allErrors: true });
    // const schema = require('../test_data/schema/hoverfly-simulation-schema.json');
    // const schemaValidator = ajv.compile(schema);
    
    // let validatedOK = schemaValidator(drefObj);
    
    //if(!validatedOK){
        // schemaValidator.errors.forEach((err)=> console.error(err.keyword+' -> '+err.message));
   // } else{
   // var jsonString = JSON.stringify(drefObj);
    //fmt.append(jsonString);
    //let jsonData =  fmt.flush();
        // fs.writeFile(
        //     './test_data/build/msl-hoverfly.json', 
        //     jsonString,
        //     (err)=>{
        //        if (err) console.error(err)
        //     }
        // )
        // fs.close(
        //     (err)=>{console.error(err)}
        // )
    //}
}
// Function to validate hoverfly simulation json with schema  
export function validateSchema(option, drefObj){
    // initialize the schema validators ajv

    const ajv = new Ajv({ allErrors: true });
    const schema = require(option.schema);
    const schemaValidator = ajv.compile(schema);

    if (!schemaValidator(drefObj)) {
        schemaValidator.errors.forEach((err)=> console.error(err.keyword+' => '+err.message +'::'+err));
    }

}

// function method to minify JSON
export function minifyJSON(filePath){

    let fmt = new JSONFormatter(JSONFormatter.MINI);
        fmt.append(jsonString);
        fmt.flush();
}