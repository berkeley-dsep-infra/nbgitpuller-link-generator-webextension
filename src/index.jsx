// GitHub uses Primer (https://primer.style/css/) as its design system

import ReactDOM from 'react-dom';
import React, { useEffect } from 'react';
import GitUrlParse from 'git-url-parse';

import { useState } from 'react';

import { Button, Box, Text, Popover, Heading, ThemeProvider, TextInput, SelectMenu, DropdownMenu, DropdownButton } from '@primer/components';

import { CopyIcon, TabExternalIcon } from '@primer/octicons-react';

import { AVAILABLE_APPS, generateRegularUrl } from './generator';
import { getPref, setPref } from './prefs';

// Backward compatible function - supports both old (3 params) and new (4 params) signatures
function copyGeneratedUrl(hubUrl, app, open, targetPath = null) {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, function (tabs) {
        const activeTab = tabs[0];
        if (activeTab) {
            const parts = GitUrlParse(activeTab.url);
            const repoUrl = `${parts.protocol}://${parts.source}/${parts.full_name}`;
            const url = generateRegularUrl(hubUrl, repoUrl, parts.ref, app, parts.name + '/' + parts.filepath, targetPath);
            if (open) {
                chrome.tabs.create({url: url});
            } else {
                navigator.clipboard.writeText(url);
            }
        }
    });
}

function Form() {
    const [hubUrl, setHubUrl] = useState(getPref('hub-url', ''));
    const [app, setApp] = useState(getPref('app', 'classic'));
    const [targetPath, setTargetPath] = useState(getPref('target-path', ''));
    const [isValidHubUrl, setIsValidHubUrl] = useState(false);
    const [finishedCopying, setFinishedCopying] = useState(false);
    const [currentFilePath, setCurrentFilePath] = useState('');
    const [isOnShinyFile, setIsOnShinyFile] = useState(false);
    const [repoName, setRepoName] = React.useState('');
    const [showShinyFileNotification, setShowShinyFileNotification] = useState(false);

    useEffect(() => {
        try {
            new URL(hubUrl);
            setIsValidHubUrl(true);
        } catch (_) {
            setIsValidHubUrl(false);
        }
    }, [hubUrl]);

    useEffect(() => {
        setPref('hub-url', hubUrl);
    }, [hubUrl]);

    useEffect(() => {
        setPref('app', app);
    }, [app])

    useEffect(() => {
        setPref('target-path', targetPath);
    }, [targetPath])

    // Check if current GitHub page is a Shiny-related file
    useEffect(() => {
        const query = { active: true, currentWindow: true };
        chrome.tabs.query(query, function (tabs) {
            const activeTab = tabs[0];
            if (activeTab) {
                const parts = GitUrlParse(activeTab.url);
                const filepath = parts.filepath || '';
                setCurrentFilePath(filepath);
                setRepoName(parts.name || '');
                const shinyFilePattern = /\.(R|Rmd|r|rmd)$/i;
                const isShinyFile = shinyFilePattern.test(filepath) && 
                                  (filepath.toLowerCase().includes('app.') || 
                                   filepath.toLowerCase().includes('server.') ||
                                   filepath.toLowerCase().includes('ui.') ||
                                   filepath.toLowerCase().includes('global.'));
                setIsOnShinyFile(isShinyFile);
            }
        });
    }, []);

    React.useEffect(() => {
        if (app === 'shiny' && repoName) {
            if (currentFilePath && !currentFilePath.endsWith('/')) {
                const newTargetPath = `ShinyApps/${repoName}`;
                setTargetPath(newTargetPath);
                setPref('target-path', newTargetPath);
            } else {
                const newTargetPath = `ShinyApps/${repoName}`;
                setTargetPath(newTargetPath);
                setPref('target-path', newTargetPath);
            }
        }
    }, [app, repoName, currentFilePath]);

    React.useEffect(() => {
        if (app === 'shiny' && currentFilePath && (currentFilePath.endsWith('.R') || currentFilePath.endsWith('.Rmd'))) {
            setShowShinyFileNotification(true);
        } else {
            setShowShinyFileNotification(false);
        }
    }, [app, currentFilePath]);

    const handleGenerateLink = (openInNewTab) => {
        copyGeneratedUrl(hubUrl, app, openInNewTab, targetPath);
        setFinishedCopying(true);
        setTimeout(() => setFinishedCopying(false), 3 * 1000)
    };

    const handleSelectChange = (event) => {
        const selectedItemKey = event.target.value;
        setApp(selectedItemKey);
    };

    const options = Object.entries(AVAILABLE_APPS).map(([key, value]) => (
        <option value={key} key={key}>{value.title}</option>
    ));

    return <Box display="flex" flexDirection="column">
        <Box mb={2}>
            <Heading sx={{ fontSize: 2, mb: 1, mt: 3 }}>JupyterHub URL</Heading>
            <div className="select-container" style={{ width: '100%' }}>
                <TextInput
                    value={hubUrl}
                    onChange = {
                        (ev) => setHubUrl(ev.target.value)
                    }
                    placeholder="https://example.edu"
                    aria-label="JupyterHub URL"
                    className="custom-select"
                    sx={{ pt: 0.5, pb: 0.5, width: '100%', boxSizing: 'border-box' }}
                />
            </div>
            <Text color="danger.fg" sx={{ visibility: isValidHubUrl ? "hidden" : "visible" }}>Enter a valid URL</Text>
        </Box>

        <Heading sx={{ fontSize: 2, mb: 1, mt: 3 }}>Open in</Heading>

        <div class="select-container">
            <select class="custom-select" value={app} onChange={handleSelectChange}>
                {options}
            </select>
        </div>
       
        {app === 'shiny' && (
            <>
                {isOnShinyFile && (
                    <Box sx={{ 
                        backgroundColor: 'success.subtle', 
                        border: '1px solid', 
                        borderColor: 'success.muted',
                        borderRadius: 2, 
                        p: 2, 
                        mb: 2, 
                        mt: 2 
                    }}>
                        <Text sx={{ fontSize: 1, fontWeight: 'semibold', color: 'success.fg' }}>
                            ✅ Smart Detection: Shiny File Found
                        </Text>
                        <Text sx={{ fontSize: 1, color: 'success.fg', mt: 1 }}>
                            Detected <strong>{currentFilePath.split('/').pop()}</strong> in your current view. 
                        </Text>
                        <Text sx={{ fontSize: 1, color: 'success.fg' }}>
                            • <strong>Directory</strong>: {currentFilePath.includes('/') ? currentFilePath.substring(0, currentFilePath.lastIndexOf('/')) : 'root folder'} (will be used in urlpath)
                        </Text>
                        <Text sx={{ fontSize: 1, color: 'success.fg' }}>
                            • <strong>File</strong>: {currentFilePath.split('/').pop()} (auto-filled in target path as ShinyApps/repo-name)
                        </Text>
                    </Box>
                )}
                
                <Heading sx={{ fontSize: 2, mb: 1, mt: 3 }}>Target Path</Heading>
                <div className="select-container" style={{ width: '100%' }}>
                    <TextInput
                        value={targetPath}
                        onChange={(ev) => setTargetPath(ev.target.value)}
                        placeholder={`ShinyApps/${repoName}`}
                        aria-label="Target path for Shiny app"
                        className="custom-select"
                        sx={{ pt: 0.5, pb: 0.5, width: '100%', boxSizing: 'border-box' }}
                    />
                </div>
                <Text sx={{ fontSize: 1, color: "fg.muted", mt: 1 }}>
                    Specifies where the shiny app will be launched in user's home directory in datahub
                </Text>
            </>
        )}

        <div class='button-row'>
            <Button disabled={!isValidHubUrl || finishedCopying} sx={{ mt: 2}} onClick={() => {
                copyGeneratedUrl(hubUrl, app, true, targetPath);
            }}>
                <TabExternalIcon /> Open in tab
            </Button>

            <Button
                disabled={!isValidHubUrl || finishedCopying}
                className="action-button"
                onClick={() => {
                    copyGeneratedUrl(hubUrl, app, false, targetPath);
                    setFinishedCopying(true);
                    setTimeout(() => setFinishedCopying(false), 3 * 1000)
                }}>
                <CopyIcon /> {finishedCopying ? "Copied!" : "Copy nbgitpuller link"}
            </Button>
            
        </div>
    </Box>
}


function setup() {
    const root = document.getElementById("root");
    ReactDOM.render(
            <ThemeProvider>
                <Form />
            </ThemeProvider>,
            root
    );
}

setup();
