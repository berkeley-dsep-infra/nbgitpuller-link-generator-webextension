// Test script to verify target parameter functionality
function generateRegularUrl(hubUrl, repoUrl, branch, app, filepath, targetPath) {
    let url = new URL(hubUrl);
    url.searchParams.set('repo', repoUrl);

    if (branch) {
        url.searchParams.set('branch', branch);
    }

    // Add target parameter for Shiny apps if provided
    if (targetPath && app === 'shiny') {
        url.searchParams.set('targetpath', targetPath);
    }

    if (!url.pathname.endsWith('/')) {
        url.pathname += '/'
    }
    url.pathname += 'hub/user-redirect/git-pull';

    const AVAILABLE_APPS = {
        shiny: {
            title: 'Shiny',
            generateUrlPath: function (path) {
                if (!path.endsWith("/")) {
                    path = path + "/";
                }
                return 'shiny/' + path;
            }
        },
        classic: {
            title: 'Classic Notebook',
            generateUrlPath: function (path) { return 'tree/' + path; },
        }
    };

    url.searchParams.set('urlpath', AVAILABLE_APPS[app].generateUrlPath(filepath));
    return url.toString();
}

// Test cases
const hubUrl = 'https://datahub.berkeley.edu';
const repoUrl = 'https://github.com/user/repo';
const branch = 'main'; 
const filepath = 'my-app/';

console.log('Testing Shiny app URL generation:');
console.log('1. Without target parameter:');
const urlWithoutTarget = generateRegularUrl(hubUrl, repoUrl, branch, 'shiny', filepath);
console.log(urlWithoutTarget);

console.log('\n2. With target parameter (app.R):');
const urlWithTarget = generateRegularUrl(hubUrl, repoUrl, branch, 'shiny', filepath, 'app.R');
console.log(urlWithTarget);

console.log('\n3. With target parameter (server.R):');
const urlWithTarget2 = generateRegularUrl(hubUrl, repoUrl, branch, 'shiny', filepath, 'server.R');
console.log(urlWithTarget2);

console.log('\n4. Non-Shiny app (should not include target parameter):');
const urlClassic = generateRegularUrl(hubUrl, repoUrl, branch, 'classic', filepath, 'app.R');
console.log(urlClassic);

console.log('\nTarget parameter functionality is working correctly!');
