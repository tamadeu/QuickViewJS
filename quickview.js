function qv(dataSource) {
    let data = {};

    function renderTemplate(template, data, loopData = {}) {
        const regex = /\{\{\s*(\S+)\s*\}\}/g;
        return template.replace(regex, (match, key) => {
            const keys = key.split('.');
            let value = loopData;
            keys.forEach(k => {
                if (k in value) {
                    value = value[k];
                } else {
                    value = data; // fallback to the main data object
                    keys.forEach(k => {
                        if (k in value) {
                            value = value[k];
                        } else {
                            value = match; // Keep the original tag if the key is not found
                        }
                    });
                }
            });
            return value;
        });
    }

    function renderArrayTemplate(template, data) {
        const regex = /@foreach\((\S+)\)((.|\n)*?)@endforeach/gs;
        return template.replace(regex, (match, key, content) => {
            const arrayData = data[key];
            if (Array.isArray(arrayData)) {
                return arrayData.map(item => {
                    return renderTemplate(content, item);
                }).join('');
            } else {
                console.error(`The key '${key}' is not an array.`);
                return match;
            }
        });
    }

/* FOR LOOP NOT READY YET     
function processForDirectives(content, data) {
        const forRegex = /@for\(([^)]+)\)((.|\n)*?)@endfor/gs;

        return content.replace(forRegex, (match, forCondition, block) => {
            let outputBlock = '';
            const loopParts = forCondition.match(/(.*?);(.*?);(.*)/);
            if (loopParts.length === 4) {
                let initializer = loopParts[1].trim();
                let condition = loopParts[2].trim();
                let iterator = loopParts[3].trim();

                // Extract loop variable name (e.g., "i" from "let i = 0")
                const varNameMatch = initializer.match(/let\s+(\w+)/);
                const varName = varNameMatch ? varNameMatch[1] : null;

                // Prepare a modified block where {i} is replaced with a placeholder
                const modifiedBlock = block.replace(/\{\{(.*?)\{\{i\}\}(.*?)\}\}/g, `{{\$1\${${varName}}\$2}}`);

                // Wrap the loop parts with a function, execute it
                let loopFunction = new Function('data', `with (data) {
                    let output = [];
                    ${initializer}
                    while(${condition}) {
                        let dynamicBlock = \`${block}\`.replace(/\\{\\{\\s*(.*?)\\{i\\}(.*?)\\s*\\}\\}/g, (match, prefix, postfix) => {
                            let expression = prefix + \`\${${varName}}\` + postfix;
                            return eval(expression);
                        });
                        output.push(dynamicBlock);
                        ${iterator}
                    }
                    return output.join('');
                }`);

                try {
                    outputBlock = loopFunction(data, renderTemplate);
                } catch (e) {
                    console.error("Error evaluating for loop:", e);
                    return match;  // If evaluation fails, keep the original tag
                }
            } else {
                console.error(`Invalid for loop syntax: ${forCondition}`);
            }
            return outputBlock;
        });

    } */


    function processConditionalDirectives(content, data) {
        const ifRegex = /@if\(([^)]+)\)((.|\n)*?)@endif/gs;

        return content.replace(ifRegex, (match, condition, block) => {
            const statements = block.split(/(@elseif\([^)]+\)|@else)/gs);
            let outputBlock = '';

            try {
                let conditionEvaluated = new Function('data', `with (data) { return ${condition}; }`)(data);
                if (conditionEvaluated) {
                    outputBlock = statements[0].trim();
                } else {
                    for (let i = 1; i < statements.length; i += 2) {
                        if (statements[i].startsWith('@elseif')) {
                            const elseifCondition = statements[i].replace(/@elseif\(([^)]+)\)/, '$1');
                            conditionEvaluated = new Function('data', `with (data) { return ${elseifCondition}; }`)(data);
                            if (conditionEvaluated) {
                                outputBlock = statements[i + 1].trim();
                                break;
                            }
                        } else if (statements[i].startsWith('@else')) {
                            outputBlock = statements[i + 1].trim();
                            break;
                        }
                    }
                }
            } catch (e) {
                console.error("Error evaluating condition:", e);
                return match;  // If evaluation fails, keep the original tag
            }

            return outputBlock;
        });
    }



    async function fetchDataAndRender() {
        var filename = window.location.pathname.split('/').pop();

        if (filename == '') {
            htmlFileUrl = 'index.html';
        } else {
            htmlFileUrl = filename;
        }

        // Fetching or assigning data
        const promises = [];
        for (const [key, value] of Object.entries(dataSource)) {
            if (typeof value === 'string' && value.startsWith('http')) {
                promises.push(
                    fetch(value)
                        .then(response => response.json())
                        .then(fetchedData => {
                            data[key] = fetchedData;
                        })
                );
            } else {
                data[key] = value;
            }
        }

        Promise.all(promises).then(async () => {
            const response = await fetch(htmlFileUrl);
            let htmlContent = await response.text();

            fetch(htmlFileUrl)
                .then(response => response.text())
                .then(async htmlContent => {
                    // Process includes
                    htmlContent = await processIncludeDirectives(htmlContent);

                    // Process conditionals
                    htmlContent = processConditionalDirectives(htmlContent, data);

                    // Process for loops
                    // htmlContent = processForDirectives(htmlContent, data);

                    // Render templates
                    let renderedContent = renderTemplate(htmlContent, data);
                    renderedContent = renderArrayTemplate(renderedContent, data);

                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = renderedContent;
                    document.documentElement.innerHTML = tempDiv.innerHTML;
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        });
    }


    async function processIncludeDirectives(content) {
        const includeRegex = /@include\(['"]([\w.-/]+)['"]\)/g;
        let matches;
        let allIncludedContent = content;
    
        while ((matches = includeRegex.exec(content)) !== null) {
            const fileName = matches[1];
            const includedContent = await fetchIncludeContent(fileName);
            allIncludedContent = allIncludedContent.replace(matches[0], includedContent);
        }
    
        return allIncludedContent;
    }
    
    async function fetchIncludeContent(fileName) {
        const includeFilePath = fileName + '.html';
        const response = await fetch(includeFilePath);
    
        if (response.status === 200) {
            return await response.text();
        } else {
            console.error(`Error fetching included file: ${includeFilePath}`);
            return '';
        }
    } 

    fetchDataAndRender();
}
