const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

function findHtmlFiles(dir) {
    let results = [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file === 'node_modules' || file === 'server' || file === 'dashboard' || file === '.git') continue;
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            results = results.concat(findHtmlFiles(fullPath));
        } else if (file.endsWith('.html') && file.includes('index')) {
            results.push(fullPath);
        }
    }
    return results;
}

const htmlFiles = findHtmlFiles(projectRoot);

const regexGoogle = /<!-- Google tag \(gtag\.js\) -->[\s\S]*?<\/script>\s*<script>[\s\S]*?<\/script>/im;
const regexMeta = /<!-- Meta Pixel Code -->[\s\S]*?<!-- End Meta Pixel Code -->/im;

let updatedFiles = 0;

for (const file of htmlFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Check if shared tracking is already injected
    if (!content.includes('/shared/tracking.js')) {
        // Clean up hardcoded pixels
        if (regexGoogle.test(content)) {
            content = content.replace(regexGoogle, '');
            changed = true;
        }
        if (regexMeta.test(content)) {
            content = content.replace(regexMeta, '<!-- Dynamic Tracking Injector -->\n    <script src="/shared/tracking.js"></script>');
            changed = true;
        }

        // If meta was not found, but we want to inject it in head
        if (changed && !content.includes('/shared/tracking.js')) {
            content = content.replace('</head>', '    <!-- Dynamic Tracking Injector -->\n    <script src="/shared/tracking.js"></script>\n</head>');
        } else if (!changed && content.includes('</head>')) {
            // Unconditionally inject if we didn't match the exact regex but we are in an LP
            // Let's only do it if there was an fbq or we know it's an LP (it includes /shared/lp-cover.js for example)
            if (content.includes('/shared/') || content.includes('fbq(') || content.includes('gtag(')) {

                // Manual removal of fbq inline if any left over
                content = content.replace(/fbq\('init', '.*?'\);/g, '');
                content = content.replace(/fbq\('track', 'PageView'\);/g, '');

                content = content.replace('</head>', '    <!-- Dynamic Tracking Injector -->\n    <script src="/shared/tracking.js"></script>\n</head>');
                changed = true;
            }
        }

        if (changed) {
            fs.writeFileSync(file, content, 'utf8');
            console.log('Updated tracking in:', file);
            updatedFiles++;
        }
    }
}

console.log(`\nSuccessfully updated dynamic tracking logic in ${updatedFiles} files!`);
