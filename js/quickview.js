function qv(dataSource) {
    let data = {};

    function renderTemplate(template, data) {
        const regex = /\{\{\s*(\S+)\s*\}\}/g;
        return template.replace(regex, (match, key) => {
            const keys = key.split('.');
            let value = data;
            keys.forEach(k => {
                if (k in value) {
                    value = value[k];
                } else {
                    value = match; // Keep the original tag if the key is not found
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
    
    

    function fetchDataAndRender() {
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

        Promise.all(promises).then(() => {
            fetch(htmlFileUrl)
                .then(response => response.text())
                .then(htmlContent => {
                    // Process includes first
                    htmlContent = processIncludeDirectives(htmlContent);

                    // Then process conditionals
                    htmlContent = processConditionalDirectives(htmlContent, data);

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


    function processIncludeDirectives(content) {
        const includeRegex = /@include\('([\w.-]+)'\)/g;
        return content.replace(includeRegex, (match, fileName) => {
            return fetchIncludeContent(fileName);
        });
    }

    function fetchIncludeContent(fileName) {
        const includeFilePath = fileName + '.html';
        let includedContent = '';

        // Synchronous XMLHttpRequest (for simplicity; async is recommended)
        const xhr = new XMLHttpRequest();
        xhr.open('GET', includeFilePath, false);  // synchronous request
        xhr.send();

        if (xhr.status === 200) {
            includedContent = xhr.responseText;
        } else {
            console.error(`Error fetching included file: ${includeFilePath}`);
        }

        return includedContent;
    }

    fetchDataAndRender();
}