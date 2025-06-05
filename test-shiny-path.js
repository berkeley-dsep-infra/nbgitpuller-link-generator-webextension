// Test Shiny URL path generation
function testShinyUrlPath() {
    console.log('🧪 Testing Shiny URL path generation...\n');
    
    // Simulate the generateUrlPath function for Shiny
    function generateShinyUrlPath(path) {
        // For Shiny apps, we only want the directory path, not the filename
        let directoryPath = path;
        
        // If path contains a file (has extension), extract just the directory
        if (path.includes('/') && path.match(/\.[^/]+$/)) {
            // Path contains a file with extension, get directory part
            directoryPath = path.substring(0, path.lastIndexOf('/'));
        }
        
        // Remove trailing slash if present, then add it back
        directoryPath = directoryPath.replace(/\/$/, '');
        
        // jupyter-shiny-proxy requires everything to end with a trailing slash
        if (!directoryPath.endsWith("/")) {
            directoryPath = directoryPath + "/";
        }
        
        return 'shiny/' + directoryPath;
    }
    
    // Test cases
    const testCases = [
        {
            input: 'my-repo/shiny-app/app.R',
            expected: 'shiny/my-repo/shiny-app/',
            description: 'File with .R extension in subdirectory'
        },
        {
            input: 'my-repo/dashboard/server.R',
            expected: 'shiny/my-repo/dashboard/',
            description: 'server.R file in subdirectory'
        },
        {
            input: 'my-repo/app/',
            expected: 'shiny/my-repo/app/',
            description: 'Directory path with trailing slash'
        },
        {
            input: 'my-repo/app',
            expected: 'shiny/my-repo/app/',
            description: 'Directory path without trailing slash'
        },
        {
            input: 'simple-app/ui.R',
            expected: 'shiny/simple-app/',
            description: 'ui.R file in root directory'
        }
    ];
    
    let allPassed = true;
    
    testCases.forEach((testCase, index) => {
        const result = generateShinyUrlPath(testCase.input);
        const passed = result === testCase.expected;
        
        console.log(`Test ${index + 1}: ${testCase.description}`);
        console.log(`  Input:    "${testCase.input}"`);
        console.log(`  Expected: "${testCase.expected}"`);
        console.log(`  Got:      "${result}"`);
        console.log(`  Status:   ${passed ? '✅ PASS' : '❌ FAIL'}\n`);
        
        if (!passed) allPassed = false;
    });
    
    console.log(`Overall result: ${allPassed ? '✅ All tests passed!' : '❌ Some tests failed!'}`);
    return allPassed;
}

testShinyUrlPath();
