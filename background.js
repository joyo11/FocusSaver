// Initialize default settings when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        skipIntros: true,
        skipOutros: true,
        skipAds: true,
        enabled: true
    });
});
// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getSettings') {
        chrome.storage.sync.get(['skipIntros', 'skipOutros', 'skipAds', 'enabled'], (settings) => {
            sendResponse(settings);
        });
        return true; // Required for async response
    }
}); 
