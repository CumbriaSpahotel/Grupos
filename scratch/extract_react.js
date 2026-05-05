const fs = require('fs');
const path = require('path');

const extractFromHtml = (fileName, baseName) => {
    const htmlFile = path.join(__dirname, '..', fileName);
    if (!fs.existsSync(htmlFile)) return;
    
    let htmlContent = fs.readFileSync(htmlFile, 'utf8');

    const startTag = '<script type="text/babel">';
    const endTag = '</script>';

    const startIndex = htmlContent.indexOf(startTag);
    if (startIndex !== -1) {
        let scriptStart = startIndex + startTag.length;
        let endIndex = htmlContent.indexOf(endTag, scriptStart);
        
        if (endIndex !== -1) {
            const jsxContent = htmlContent.substring(scriptStart, endIndex);
            
            const srcDir = path.join(__dirname, '../src');
            if (!fs.existsSync(srcDir)) {
                fs.mkdirSync(srcDir);
            }
            
            fs.writeFileSync(path.join(srcDir, `${baseName}.jsx`), jsxContent, 'utf8');
            
            const newHtml = htmlContent.substring(0, startIndex) + 
                            `<script src="js/${baseName}.js"></script>` + 
                            htmlContent.substring(endIndex + endTag.length);
                            
            fs.writeFileSync(htmlFile, newHtml, 'utf8');
            console.log(`Successfully extracted ${baseName}.jsx and updated ${fileName}.`);
        } else {
            console.log(`Could not find closing script tag in ${fileName}.`);
        }
    } else {
        console.log(`No <script type="text/babel"> found in ${fileName}.`);
    }
}

const files = fs.readdirSync(path.join(__dirname, '..')).filter(f => f.endsWith('.html') && f !== 'index.html');

files.forEach(file => {
    // Generate safe basename (e.g. "Fac Prof.html" -> "FacProf")
    const baseName = file.replace('.html', '').replace(/\s+/g, '');
    // Skip if already processed or is index
    extractFromHtml(file, baseName);
});
