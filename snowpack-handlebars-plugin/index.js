var handlebars = require('handlebars');
var helpers = require('handlebars-helpers')({
  handlebars: handlebars
});

var fs = require('fs-extra');
var path = require('path');
var YAML = require('yamljs');
var parse = require('csv-parse/lib/sync')


module.exports = function (snowpackConfig, pluginOptions) {
  function retrieveData(templateMeta) {
    let output = templateMeta;

    if (templateMeta.data) {
      let rawData = fs.readFileSync(path.join(pluginOptions.srcPath, '/data/', templateMeta.data));

      if (templateMeta.data.includes('.json')) {
        output = JSON.parse(rawData);
      } else if (templateMeta.data.includes('.csv')) {
        output = {
          rows: parse(rawData, {
            columns: true,
            skip_empty_lines: true
          })
        }
      }
    }

    if (templateMeta.script) {
      const scriptPath = path.join(process.cwd(), pluginOptions.srcPath, 'data/scripts', templateMeta.script);
      if (fs.existsSync(scriptPath))  {
        const script = require(scriptPath)
        output = script.run(output, {
          csvParse: parse
        });
      }
    }

    if (output.pages) {
      output.pages.forEach(page => {
        page.meta = templateMeta;
      });
    }

    return output;
  }

  function handleTemplateChange(filePath) {
    const fileBasename = path.basename(filePath);
    let source = fs.readFileSync(filePath, 'utf8');
    let templateMeta = {};

    const sourceParts = source.split('---');
    if (sourceParts.length > 2) {
      templateMeta = YAML.parse(sourceParts[1]);
      source = sourceParts[2];
    }
    
    const template = handlebars.compile(source);

    if (fileBasename === 'index.hbs' && !templateMeta.output) {
      templateMeta.output = 'index.html';
    }

    const output = templateMeta.output || fileBasename.replace('.hbs', '/index.html');
    const outputFilePath = path.join(pluginOptions.outputPath, output);


    const templateData = retrieveData(templateMeta);
    
    if (templateData.pages) {
      templateData.pages.forEach((page) => {
        const pageOutputPath = outputFilePath.replace('@ID@', page.pageId).replace('@PAGENUM@', page.pageNum);
        fs.ensureDirSync(path.dirname(pageOutputPath));
        try {
          fs.writeFileSync(pageOutputPath, template(page), 'utf8');
        } catch (e) {
          console.error(e.message);
        }
      });
    } else {
      fs.ensureDirSync(path.dirname(outputFilePath));
      try {
        fs.writeFileSync(outputFilePath, template(templateData), 'utf8');
      } catch (e) {
        console.error(e.message);
      }
    }
  }

  function renderTemplates() {
    const templatesPath = path.join(pluginOptions.srcPath, 'templates');
    fs.readdir(templatesPath, (err, files) => {
      if (err) {
          throw err;
      }
  
      files.forEach(file => {
        if (path.extname(file) === '.hbs') {
          const filePath = path.join(templatesPath, file);
          handleTemplateChange(filePath);
        }
      });
    });
  }

  function handlePartialChange(filePath, skipRendering) {
    const fileBasename = path.basename(filePath);
    let source = fs.readFileSync(filePath, 'utf8');
    
    handlebars.registerPartial(fileBasename.split('.')[0], source);

    if (!skipRendering) {
      renderTemplates();
    }
  }

  function registerPartials() {
    const partialsPath =  path.join(pluginOptions.srcPath, 'partials')
    if (fs.existsSync(partialsPath))  {
        fs.readdir(partialsPath, (err, files) => {
          if (err) {
              throw err;
          }
      
          files.forEach(file => {
            if (path.extname(file) === '.hbs') {
              const filePath = path.join(partialsPath, file);
              handlePartialChange(filePath, true);
            }
          });
      });
    }
  }

  function registerHelpers() {
    const helpersPath =  path.join(process.cwd(), pluginOptions.srcPath, 'helpers.js')
    if (fs.existsSync(helpersPath))  {
      const helpers = require(helpersPath)
      helpers.run(handlebars);
    }
  }

  // removes previous output
  fs.removeSync(pluginOptions.outputPath);

  registerPartials();
  registerHelpers();
  renderTemplates();
  
  return {
    name: 'snowpack-handlebars-plugin',

    onChange({ filePath }) {
      if (path.extname(filePath) === '.hbs' && fs.existsSync(filePath)) {
        if (filePath.includes('partials')) {
          handlePartialChange(filePath);
        } else {
          handleTemplateChange(filePath);
        }
      } else if (filePath.includes('data') && fs.existsSync(filePath)) {  
        renderTemplates();
      } 
    }
  };
};
