// Test file detection logic
function testShinyFileDetection() {
    console.log('🧪 Testing Shiny file detection logic...\n');
    
    function isShinyFile(filepath) {
        const shinyFilePattern = /\.(R|Rmd|r|rmd)$/i;
        return shinyFilePattern.test(filepath) && 
               (filepath.toLowerCase().includes('app.') || 
                filepath.toLowerCase().includes('server.') ||
                filepath.toLowerCase().includes('ui.') ||
                filepath.toLowerCase().includes('global.'));
    }
    
    const testCases = [
        { path: 'my-project/app.R', expected: true, desc: 'app.R file' },
        { path: 'dashboard/server.R', expected: true, desc: 'server.R file' },
        { path: 'shiny-app/ui.R', expected: true, desc: 'ui.R file' },
        { path: 'analysis/global.R', expected: true, desc: 'global.R file' },
        { path: 'my-project/app.Rmd', expected: true, desc: 'app.Rmd file' },
        { path: 'data/analysis.R', expected: false, desc: 'regular R file' },
        { path: 'docs/README.md', expected: false, desc: 'markdown file' },
        { path: 'my-project/', expected: false, desc: 'directory' },
        { path: 'scripts/helper.R', expected: false, desc: 'helper R file' }
    ];
    
    testCases.forEach((test, i) => {
        const result = isShinyFile(test.path);
        const status = result === test.expected ? '✅ PASS' : '❌ FAIL';
        console.log(`${i+1}. ${test.desc}: ${test.path} → ${result} ${status}`);
    });
}

testShinyFileDetection();
