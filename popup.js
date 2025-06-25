// Initialize settings with all options disabled by default
const DEFAULT_SETTINGS = {
    enabled: false,
    skipIntros: false,
    skipOutros: false,
    skipAds: false
};
let hasChanges = false;
let isFirstTime = true;
// Function to update the skip options state
function updateSkipOptionsState(enabled) {
    const skipOptions = ['skipIntros', 'skipOutros', 'skipAds'];
    skipOptions.forEach(option => {
        const element = document.getElementById(option);
        element.disabled = !enabled;
        element.parentElement.classList.toggle('disabled', !enabled);
    });
}

// Load saved settings or set defaults
chrome.storage.sync.get(['enabled', 'skipIntros', 'skipOutros', 'skipAds', 'hasInitialized'], (prefs) => {
    // If extension hasn't been initialized, set default values
    if (!prefs.hasInitialized) {
        // Set all options to disabled by default
        document.getElementById('enabled').checked = false;
        document.getElementById('skipIntros').checked = false;
        document.getElementById('skipOutros').checked = false;
        document.getElementById('skipAds').checked = false;
        
        // Disable skip options
        updateSkipOptionsState(false);
        
        // Disable save button
        const saveButton = document.getElementById('saveButton');
        saveButton.disabled = true;
        saveButton.style.opacity = '0.5';
        saveButton.style.cursor = 'not-allowed';
    } else {
        // Load saved settings
        document.getElementById('enabled').checked = prefs.enabled || false;
        document.getElementById('skipIntros').checked = prefs.skipIntros || false;
        document.getElementById('skipOutros').checked = prefs.skipOutros || false;
        document.getElementById('skipAds').checked = prefs.skipAds || false;
        
        // Update UI state
        updateSkipOptionsState(prefs.enabled || false);
        isFirstTime = false;
        
        // Update save button state
        const saveButton = document.getElementById('saveButton');
        saveButton.disabled = !prefs.enabled;
        saveButton.style.opacity = prefs.enabled ? '1' : '0.5';
        saveButton.style.cursor = prefs.enabled ? 'pointer' : 'not-allowed';
    }
});

// Handle main toggle changes
document.getElementById('enabled').addEventListener('change', (e) => {
    const enabled = e.target.checked;
    const saveButton = document.getElementById('saveButton');
    
    // Enable/disable save button based on main toggle
    saveButton.disabled = !enabled;
    saveButton.style.opacity = enabled ? '1' : '0.5';
    saveButton.style.cursor = enabled ? 'pointer' : 'not-allowed';
    
    updateSkipOptionsState(enabled);
    hasChanges = true;
    document.getElementById('saveButton').classList.add('has-changes');
});

// Track changes when checkboxes are modified
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        hasChanges = true;
        document.getElementById('saveButton').classList.add('has-changes');
    });
});

// Handle save button click
document.getElementById('saveButton').addEventListener('click', async () => {
    if (!hasChanges || document.getElementById('saveButton').disabled) return;

    const saveButton = document.getElementById('saveButton');
    const fullscreenLoader = document.querySelector('.fullscreen-loader');
    
    saveButton.classList.add('loading');
    fullscreenLoader.classList.add('visible');
    
    // Get all settings
    const settings = {
        enabled: document.getElementById('enabled').checked,
        skipIntros: document.getElementById('skipIntros').checked,
        skipOutros: document.getElementById('skipOutros').checked,
        skipAds: document.getElementById('skipAds').checked
    };

    // If extension is disabled, ensure all skip options are disabled too
    if (!settings.enabled) {
        settings.skipIntros = false;
        settings.skipOutros = false;
        settings.skipAds = false;
        
        // Update UI to reflect this
        document.getElementById('skipIntros').checked = false;
        document.getElementById('skipOutros').checked = false;
        document.getElementById('skipAds').checked = false;
    }

    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Save settings
    chrome.storage.sync.set({
        ...settings,
        hasInitialized: true // Mark that extension has been initialized
    }, () => {
        saveButton.classList.remove('loading');
        showStatus(isFirstTime ? 'Settings initialized!' : 'Settings saved successfully!');
        hasChanges = false;
        isFirstTime = false;
        saveButton.classList.remove('has-changes');

        // Refresh all YouTube tabs
        chrome.tabs.query({url: '*://*.youtube.com/*'}, (tabs) => {
            tabs.forEach(tab => {
                chrome.tabs.reload(tab.id);
            });
            if (tabs.length > 0) {
                showStatus('YouTube tabs refreshed!');
            }
            
            // Hide loader and close popup after a short delay
            setTimeout(() => {
                fullscreenLoader.classList.remove('visible');
                window.close();
            }, 500);
        });
    });
});

// Handle close button click
document.getElementById('closeButton').addEventListener('click', () => {
    window.close();
});

// Show status message with animation
function showStatus(message) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.style.display = 'block';
    status.style.opacity = '0';
    
    // Fade in
    requestAnimationFrame(() => {
        status.style.opacity = '1';
    });
    
    // Fade out after delay
    setTimeout(() => {
        status.style.opacity = '0';
        setTimeout(() => {
            status.style.display = 'none';
        }, 300);
    }, 2000);
} 
