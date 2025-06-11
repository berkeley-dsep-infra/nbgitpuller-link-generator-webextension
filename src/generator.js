// Backward compatible function - supports both old (5 params) and new (6 params) signatures
function generateRegularUrl(hubUrl, repoUrl, branch, app, filepath, targetPath = null) {
    let url = new URL(hubUrl);

    url.searchParams.set('repo', repoUrl);

    if (branch) {
        url.searchParams.set('branch', branch);
    }

    if (!url.pathname.endsWith('/')) {
        url.pathname += '/'
    }
    url.pathname += 'hub/user-redirect/git-pull';

    url.searchParams.set('urlpath', AVAILABLE_APPS[app].generateUrlPath(filepath));

    // Add target parameter for Shiny apps if provided (after urlpath)
    if (targetPath && app === 'shiny') {
        url.searchParams.set('targetpath', targetPath);
    }

    return url.toString();
}

const AVAILABLE_APPS = {
    classic: {
        title: 'Classic Notebook',
        generateUrlPath: function (path) { return 'tree/' + path; },
    },
    jupyterlab: {
        title: 'JupyterLab',
        generateUrlPath: function (path) { return 'lab/tree/' + path; }
    },
    shiny: {
        title: 'Shiny',
        generateUrlPath: function (path) {
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
    },
    rstudio: {
        title: 'RStudio',
        generateUrlPath: function (path) { return 'rstudio/'; }
    }, 
    vscode: {
        title: 'VSCode',
        generateUrlPath: function (path) { return 'vscode/'; }
    }
}

export {AVAILABLE_APPS, generateRegularUrl}