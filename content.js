// Regular expression to match timestamps in format "HH:MM:SS" or "MM:SS" with descriptions
    const TIMESTAMP_REGEX = /(?:(\d{1,2}):)?(\d{1,2}):(\d{2})(?:\s*[-–—]\s*|\s+)(.*?)(?=(?:\d{1,2}:)?\d{1,2}:\d{2}|$)/g;

// Minimum video durationw (in seconds) for skipping to be enabled
    const MIN_VIDEO_DURATION = 60; // Minimum video duration in seconds to enable skipping

// Default skip percentage when no timestamps available
const DEFAULT_INTRO_PERCENTAGE = 0.08; // 8%
const DEFAULT_OUTRO_PERCENTAGE = 0.05; // 5%

    // Add at the top with other constants
    let currentSkipInterval = null;
    let lastSkipTime = 0;
    const SKIP_COOLDOWN = 2000; // 2 seconds cooldown between skips

// Function to convert timestamp stringw to seconds
function timestampToSeconds(timestamp) {
    const parts = timestamp.split(':').reverse();
    let seconds = 0;
    
    if (parts.length >= 1) seconds += parseInt(parts[0]);
    if (parts.length >= 2) seconds += parseInt(parts[1]) * 60;
    if (parts.length >= 3) seconds += parseInt(parts[2]) * 3600;
    
    return seconds;
}

    // Function to find the video element
    function findVideoElement() {
        const videoSelectors = [
            'video',
            'video.html5-main-video',
            'ytd-player video'
        ];
        
        for (const selector of videoSelectors) {
            const video = document.querySelector(selector);
            if (video) {
                console.log('Focus Saver: Found video using selector:', selector);
                return video;
            }
        }
        return null;
    }

    // Function to skip to a specific timestamp
    function skipToTimestamp(seconds) {
    const video = findVideoElement();
        if (video) {
            const duration = video.duration;
            const currentTime = Date.now();
            
            // Don't skip if we recently skipped
            if (currentTime - lastSkipTime < SKIP_COOLDOWN) {
                console.log('Focus Saver: Skipping too fast, but forcing skip anyway');
                // Continue instead of returning to ensure skips work properly
            }
            
            // Don't skip if the video is too short
            if (duration < MIN_VIDEO_DURATION) {
                console.log('Focus Saver: Video too short, skipping disabled');
                return;
            }
            
            // Don't skip if it would skip more than 90% of the video
            if (seconds > duration * 0.9) {
                console.log('Focus Saver: Skip would skip too much content, aborting');
                return;
            }
            
            console.log('Focus Saver: Skipping to', seconds, 'seconds (from', video.currentTime, 'seconds)');
            // Force a more significant skip to ensure it takes effect
            video.currentTime = seconds;
            lastSkipTime = currentTime;
        }
    }

    // Function to check if a description is an introduction
    function isIntro(description) {
        if (!description) return false;
        
        const introKeywords = [
            'intro', 'intros',
            'introduction', 'introductions',
            'opening', 'openings',
            'title', 'titles',
            'theme', 'themes',
            'start', 'starts',
            'beginning', 'beginnings',
            'preview', 'previews',
            'prelude', 'preludes',
            'prologue', 'prologues',
            'opening credits',
            'title sequence',
            'theme song',
            'opening theme',
            'intro theme',
            'opening song',
            'intro song',
            'title card',
            'opening card',
            'intro card',
            'opening sequence',
            'intro sequence',
            'title sequence',
            'opening scene',
            'intro scene',
            'title scene',
            'opening animation',
            'intro animation',
            'title animation',
            'opening montage',
            'intro montage',
            'title montage',
            'welcome',
            'introduction to',
            'introduction of',
            'beginning of',
            'start of',
            'show intro',
            'series intro',
            'channel intro',
            'video intro',
            'episode intro',
            'season intro',
            'series opening',
            'episode opening',
            'season opening',
            'show opening',
            'channel opening',
            'video opening',
            'series start',
            'episode start',
            'season start',
            'show start',
            'channel start',
            'video start',
            'series beginning',
            'episode beginning',
            'season beginning',
            'show beginning',
            'channel beginning',
            'video beginning'
        ];
        
        description = description.toLowerCase().trim();
        
        // First check exact matches
        if (introKeywords.some(keyword => description === keyword)) {
            return true;
        }
        
        // Then check includes
        if (introKeywords.some(keyword => description.includes(keyword))) {
            return true;
        }
        
        // Check for common intro patterns
        const introPatterns = [
            /^intro/i,
            /^introduction/i,
            /^opening/i,
            /^title/i,
            /^theme/i,
            /^start/i,
            /^beginning/i,
            /^preview/i,
            /^prelude/i,
            /^prologue/i,
            /opening credits/i,
            /title sequence/i,
            /theme song/i,
            /opening theme/i,
            /intro theme/i,
            /opening song/i,
            /intro song/i,
            /title card/i,
            /opening card/i,
            /intro card/i,
            /opening sequence/i,
            /intro sequence/i,
            /title sequence/i,
            /opening scene/i,
            /intro scene/i,
            /title scene/i,
            /opening animation/i,
            /intro animation/i,
            /title animation/i,
            /opening montage/i,
            /intro montage/i,
            /title montage/i,
            /^welcome/i,
            /^introduction to/i,
            /^introduction of/i,
            /^beginning of/i,
            /^start of/i,
            /^show intro/i,
            /^series intro/i,
            /^channel intro/i,
            /^video intro/i,
            /^episode intro/i,
            /^season intro/i,
            /^series opening/i,
            /^episode opening/i,
            /^season opening/i,
            /^show opening/i,
            /^channel opening/i,
            /^video opening/i,
            /^series start/i,
            /^episode start/i,
            /^season start/i,
            /^show start/i,
            /^channel start/i,
            /^video start/i,
            /^series beginning/i,
            /^episode beginning/i,
            /^season beginning/i,
            /^show beginning/i,
            /^channel beginning/i,
            /^video beginning/i
        ];
        
        return introPatterns.some(pattern => pattern.test(description));
    }

    // Function to check if a timestamp is an outro
    function isOutro(description) {
        if (!description) return false;
        
        const outroKeywords = [
            'outro', 'outros',
            'end', 'ending',
            'conclusion', 'conclusions',
            'credits', 'credit',
            'thanks for watching',
            'thank you for watching',
            'final thoughts',
            'wrap up',
            'closing',
            'goodbye',
            'farewell',
            'see you next time',
            'until next time',
            'that\'s all',
            'that\'s it',
            'the end',
            'final words',
            'closing remarks',
            'end credits',
            'end card',
            'end screen',
            'subscribe',
            'like and subscribe',
            'please subscribe',
            'don\'t forget to subscribe',
            'hit the subscribe button',
            'hit the like button',
            'leave a comment',
            'let me know in the comments',
            'comment below',
            'share this video',
            'share with your friends'
        ];
        
        description = description.toLowerCase().trim();
        
        // First check exact matches
        if (outroKeywords.some(keyword => description === keyword)) {
            return true;
        }
        
        // Then check includes
        if (outroKeywords.some(keyword => description.includes(keyword))) {
            return true;
        }
        
        // Check for common outro patterns
        const outroPatterns = [
            /^outro/i,
            /^end/i,
            /^conclusion/i,
            /^credits/i,
            /^final thoughts/i,
            /^wrap up/i,
            /^closing/i,
            /^goodbye/i,
            /^farewell/i,
            /^see you/i,
            /^until next/i,
            /^that's all/i,
            /^that's it/i,
            /^the end/i,
            /^final words/i,
            /^closing remarks/i,
            /^end credits/i,
            /^end card/i,
            /^end screen/i,
            /^subscribe/i,
            /^like and subscribe/i,
            /^please subscribe/i,
            /^don't forget to subscribe/i,
            /^hit the subscribe/i,
            /^hit the like/i,
            /^leave a comment/i,
            /^let me know in the comments/i,
            /^comment below/i,
            /^share this video/i,
            /^share with your friends/i
        ];
        
        return outroPatterns.some(pattern => pattern.test(description));
    }

    // Function to check if a timestamp is an ad
    function isAd(description) {
        if (!description) return false;
        
        const adKeywords = [
            'sponsor', 'sponsored', 
            'ad', 'ads', 'advertisement',
            'promotion', 'promotional',
            'deal', 'deals',
            'merch', 'merchandise',
            'product', 'products',
            'brought to you by',
            'check out',
            'thanks to',
            'sponsored by',
            'affiliate',
            'partnership',
            'today\'s sponsor',
            'sponsorship',
            'promo',
            'promotion',
            'brand deal',
            'integration',
            'sponsor segment',
            'paid promotion',
            'ad break',
            'advertisement break',
            'commercial break',
            'sponsor break',
            'promotional break'
        ];
        
        description = description.toLowerCase().trim();
        
        // First check exact matches
        if (adKeywords.some(keyword => description === keyword)) {
            return true;
        }
        
        // Then check includes
        if (adKeywords.some(keyword => description.includes(keyword))) {
            return true;
        }
        
        // Check for common ad segment patterns
        const adPatterns = [
            /^sponsor/i,
            /^ad break/i,
            /^promo/i,
            /sponsor spot/i,
            /^ad spot/i,
            /^advertisement/i,
            /brand deal/i,
            /^today's sponsor/i,
            /^integrated/i,
            /^integration/i,
            /paid promotion/i,
            /commercial break/i,
            /advertisement break/i,
            /sponsor break/i,
            /promotional break/i
        ];
        
        return adPatterns.some(pattern => pattern.test(description));
    }

    // Function to calculate intro skip duration based on video length
    function calculateIntroSkipDuration(videoDuration) {
        const durationInMinutes = videoDuration / 60;
        
        // Short videos (less than 10 minutes)
        if (durationInMinutes < 10) {
            // Skip 10% of total duration, but no more than 40 seconds
            return Math.min(videoDuration * 0.1, 40);
        }
        // Medium videos (10-30 minutes)
        else if (durationInMinutes <= 30) {
            // Skip between 60-90 seconds based on length
            const ratio = (durationInMinutes - 10) / 20; // 0 to 1 based on where we are in the 10-30 minute range
            return 60 + (ratio * 30); // 60 seconds + up to additional 30 seconds
        }
        // Long videos (over 30 minutes)
        else {
            // Skip between 90-120 seconds based on length
            const ratio = Math.min((durationInMinutes - 30) / 30, 1); // 0 to 1, capped at 1
            return 90 + (ratio * 30); // 90 seconds + up to additional 30 seconds
        }
    }

    // Function to calculate outro skip duration based on video length
    function calculateOutroSkipDuration(videoDuration) {
        const durationInMinutes = videoDuration / 60;
        
        // Short videos (less than 10 minutes)
        if (durationInMinutes < 10) {
            // Skip last 10-15 seconds
            return Math.min(videoDuration - 10, videoDuration - 15);
        }
        // Medium videos (10-30 minutes)
        else if (durationInMinutes <= 30) {
            // Skip last 20-30 seconds
            const ratio = (durationInMinutes - 10) / 20; // 0 to 1 based on where we are in the 10-30 minute range
            const skipSeconds = 20 + (ratio * 10); // 20 seconds + up to additional 10 seconds
            return Math.max(videoDuration - skipSeconds, videoDuration - 30);
        }
        // Long videos (over 30 minutes)
        else {
            // Skip last 30-60 seconds
            const ratio = Math.min((durationInMinutes - 30) / 30, 1); // 0 to 1, capped at 1
            const skipSeconds = 30 + (ratio * 30); // 30 seconds + up to additional 30 seconds
            return Math.max(videoDuration - skipSeconds, videoDuration - 60);
        }
    }

    // Function to handle YouTube ads
    function handleYouTubeAds() {
        const video = findVideoElement();
        if (!video) return;

        // Check for skippable ads
        const skipBtn = document.querySelector('.ytp-ad-skip-button');
        if (skipBtn) {
            skipBtn.click();
            console.log('Focus Saver: ⏭️ Skipped ad via button');
            return;
        }

        // Check for overlay ads
        const closeBtn = document.querySelector('.ytp-ad-overlay-close-button');
        if (closeBtn) {
            closeBtn.click();
            console.log('Focus Saver: ❌ Closed overlay ad');
            return;
        }

        // Check for unskippable ads
        const adOverlay = document.querySelector('.ad-showing, .ytp-ad-overlay-container, .ytp-ad-player-overlay');
        if (adOverlay) {
            // Mute and speed up unskippable ads
            video.muted = true;
            video.playbackRate = 16;
            console.log('Focus Saver: 🚫 Unskippable ad detected – muting and speeding up');
            return;
        }

        // Reset video settings when no ads are playing
        if (video.muted || video.playbackRate !== 1) {
            video.muted = false;
            video.playbackRate = 1;
        }
    }

    // Function to find and parse timestamps in the description
    function findTimestamps() {
    // Try multiple selectors to find the description
    const descriptionSelectors = [
        '#description-inner',
        '#description',
        '.ytd-video-secondary-info-renderer',
        '#content-text',
        'ytd-video-secondary-info-renderer',
        'div#description',
        'div#description-inline-expander'
    ];
    
    let description = null;
    for (const selector of descriptionSelectors) {
        description = document.querySelector(selector);
        if (description) break;
    }
    
    if (!description) {
            console.log('Focus Saver: No description found, using default percentages');
        return generateDefaultTimestamps();
    }
    
    const text = description.textContent;
    const timestamps = [];
    let match;
        
        // Reset regex lastIndex
        TIMESTAMP_REGEX.lastIndex = 0;
    
    while ((match = TIMESTAMP_REGEX.exec(text)) !== null) {
        const [fullMatch, hours, minutes, seconds, description = ''] = match;
            const timeStr = fullMatch.match(/(?:\d{1,2}:)?\d{1,2}:\d{2}/)[0];
            const timeInSeconds = timestampToSeconds(timeStr);
            
            // Clean up the description
            const cleanDesc = description.trim()
                .replace(/^[-–—\s]+/, '') // Remove leading dashes and spaces
                .replace(/[-–—\s]+$/, ''); // Remove trailing dashes and spaces
            
            console.log('Focus Saver: Found timestamp:', {
                time: timeStr,
                seconds: timeInSeconds,
                description: cleanDesc
            });
        
        timestamps.push({
                time: timeStr,
            seconds: timeInSeconds,
                description: cleanDesc.toLowerCase()
        });
    }
        
        // Sort timestamps by time
        timestamps.sort((a, b) => a.seconds - b.seconds);
    
    return timestamps.length > 0 ? timestamps : generateDefaultTimestamps();
}

// Function to generate default timestamps based on video duration
function generateDefaultTimestamps() {
        const video = findVideoElement();
        if (!video) return [];
        
        const duration = video.duration;
    if (duration === 0) return [];
    
    const introEnd = Math.floor(duration * DEFAULT_INTRO_PERCENTAGE);
    const outroStart = Math.floor(duration * (1 - DEFAULT_OUTRO_PERCENTAGE));
    
    return [
        {
            time: '00:00',
            seconds: 0,
                description: 'intro section',
                isDefault: true
        },
        {
            time: formatTime(introEnd),
            seconds: introEnd,
                description: 'main content',
                isDefault: true
        },
        {
            time: formatTime(outroStart),
            seconds: outroStart,
                description: 'outro section',
                isDefault: true
        }
    ];
}

// Function to format seconds to timestamp
function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Function to check if we should skip the current section
function shouldSkipSection(currentTime, timestamps) {
    chrome.storage.sync.get(['skipIntros', 'skipOutros', 'skipAds', 'enabled', 'hasInitialized'], (prefs) => {
        if (!prefs.hasInitialized || !prefs.enabled) return;
        
        const video = findVideoElement();
        if (!video) return;
        
        // Don't process skips for short videos
        if (video.duration < MIN_VIDEO_DURATION) {
                console.log('Focus Saver: Video too short, skipping disabled');
            return;
        }
        
            // Handle ad skipping first (since ads can be anywhere in the video)
            if (prefs.skipAds) {
                handleYouTubeAds();
                
                // Then check for timestamp-based ads
                if (timestamps.length > 0 && !timestamps[0].isDefault) {
                    for (let i = 0; i < timestamps.length - 1; i++) {
                        const currentSegment = timestamps[i];
                        const nextSegment = timestamps[i + 1];
                        
                        if (isAd(currentSegment.description)) {
                            if (currentTime >= currentSegment.seconds - 2 && currentTime < nextSegment.seconds) {
                                console.log('Focus Saver: Found ad segment:', {
                                    description: currentSegment.description,
                                    skipTo: nextSegment.seconds
                                });
                                skipToTimestamp(nextSegment.seconds);
                                return;
                            }
                        }
                    }
                }
            }
            
            // Handle intro skipping
            if (prefs.skipIntros) {
                // Only check for intro skipping in the first 15% of the video
                if (currentTime < video.duration * 0.15) {
                    const hasTimestamps = timestamps.length > 0 && !timestamps[0].isDefault;
                    
                    if (hasTimestamps) {
                        console.log('Focus Saver: Using timestamp-based intro detection');
                        
                        // Find all consecutive intro segments
                        let introSegments = [];
                        let foundNonIntro = false;
                        let introEndTime = null;
        
        for (let i = 0; i < timestamps.length; i++) {
                            const segment = timestamps[i];
                            if (isIntro(segment.description) && !foundNonIntro) {
                                introSegments.push(segment);
                                // Update the end time to the end of this intro segment
                                introEndTime = segment.seconds;
                            } else {
                                foundNonIntro = true;
                                // If we found intro segments and then a non-intro, we have our end point
                                if (introSegments.length > 0) {
                                    console.log('Focus Saver: Found intro sequence:', {
                                        start: introSegments[0].seconds,
                                        end: segment.seconds,
                                        segments: introSegments.length,
                                        descriptions: introSegments.map(s => s.description)
                                    });
                                    
                                    // If we're in the intro sequence, skip to the end
                                    if (currentTime < segment.seconds) {
                                        skipToTimestamp(segment.seconds);
                                        return;
                                    }
                break;
                                }
                            }
                        }
                        
                        // If we found only intro segments (no non-intro after), skip to the end of the last intro
                        if (introSegments.length > 0 && !foundNonIntro && introEndTime) {
                            console.log('Focus Saver: Found only intro segments, skipping to end of last intro:', introEndTime);
                            skipToTimestamp(introEndTime);
                return;
            }
                    } else {
                        console.log('Focus Saver: No timestamps found, using heuristic intro detection');
                        // No timestamps - use heuristic based on video length
                        const introEndTime = calculateIntroSkipDuration(video.duration);
                        console.log('Focus Saver: Using calculated duration:', introEndTime);
                        if (currentTime < introEndTime) {
                            skipToTimestamp(introEndTime);
                        }
                    return;
                    }
                }
            }
            
            // Handle outro skipping
            if (prefs.skipOutros) {
                const hasTimestamps = timestamps.length > 0 && !timestamps[0].isDefault;
                
                if (hasTimestamps) {
                    console.log('Focus Saver: Using timestamp-based outro detection');
                    
                    let outroStartIndex = -1;
                    let outroEndTime = video.duration;
                    
                    // Step 1: Find the first outro segment
                    for (let i = 0; i < timestamps.length; i++) {
                        if (isOutro(timestamps[i].description)) {
                            outroStartIndex = i;
                            break;
                        }
                    }
                    
                    // Step 2: If found, find the next non-outro segment (or default to video end)
                    if (outroStartIndex !== -1) {
                        for (let i = outroStartIndex + 1; i < timestamps.length; i++) {
                            if (!isOutro(timestamps[i].description)) {
                                outroEndTime = timestamps[i].seconds;
                                break;
                            }
                        }
                        
                        // If current time is inside the outro segment range, skip to outro end
                        const outroStartTime = timestamps[outroStartIndex].seconds;
                        if (currentTime >= outroStartTime - 2 && currentTime < outroEndTime) {
                            console.log('Focus Saver: ⏭️ Skipping outro to:', outroEndTime);
                            skipToTimestamp(outroEndTime);
                            return;
                        }
                    }
                }
                
                console.log('Focus Saver: No outro timestamps found, using heuristic outro detection');
                const heuristicOutroStart = calculateOutroSkipDuration(video.duration);
                
                if (currentTime >= heuristicOutroStart) {
                    console.log('Focus Saver: ⏭️ Heuristic outro detected, skipping to end');
                    skipToTimestamp(video.duration);
                return;
            }
        }
    });
}

// Main function to initialize the extension
function initialize() {
        console.log('Focus Saver: Initializing...');
        
        // Clear any existing interval
        if (currentSkipInterval) {
            console.log('Focus Saver: Clearing existing interval');
            clearInterval(currentSkipInterval);
            currentSkipInterval = null;
        }
    
    // First check if extension is enabled
    chrome.storage.sync.get(['enabled', 'hasInitialized'], (prefs) => {
        if (!prefs.hasInitialized || !prefs.enabled) {
                console.log('Focus Saver: Extension is disabled or not initialized, stopping initialization');
            return;
        }
        
        const timestamps = findTimestamps();
        if (timestamps.length === 0) {
                console.log('Focus Saver: No timestamps found');
            return;
        }
        
        const video = findVideoElement();
        if (!video) {
                console.log('Focus Saver: Video element not found, will retry...');
            return;
        }
        
            console.log('Focus Saver: Video element found');
        
        // Check for skips periodically
            currentSkipInterval = setInterval(() => {
            // Re-check if extension is still enabled
            chrome.storage.sync.get(['enabled', 'hasInitialized'], (currentPrefs) => {
                if (!currentPrefs.hasInitialized || !currentPrefs.enabled) {
                        console.log('Focus Saver: Extension was disabled, clearing skip interval');
                        clearInterval(currentSkipInterval);
                        currentSkipInterval = null;
                    return;
                }
                shouldSkipSection(video.currentTime, timestamps);
            });
        }, 1000);
    });

        // Set up interval to check for ads
        setInterval(() => {
            chrome.storage.sync.get(['skipAds', 'enabled', 'hasInitialized'], (prefs) => {
                if (prefs.hasInitialized && prefs.enabled && prefs.skipAds) {
                    handleYouTubeAds();
                }
            });
        }, 500);
}

// Set up MutationObserver to handle dynamic content loading
const observer = new MutationObserver((mutationsList, observer) => {
    // First check if extension is enabled
    chrome.storage.sync.get(['enabled', 'hasInitialized'], (prefs) => {
        if (!prefs.hasInitialized || !prefs.enabled) {
                console.log('Focus Saver: Extension is disabled or not initialized, not observing');
            return;
        }
        
        // Check if we have both video and timestamps
        const video = findVideoElement();
        const timestamps = findTimestamps();
        
        if (video && timestamps.length > 0) {
                console.log('Focus Saver: Found both video and timestamps through observer');
            initialize();
            observer.disconnect(); // Stop observing once we have what we need
        }
    });
});

// Start observing the body for changes only if extension is enabled
chrome.storage.sync.get(['enabled', 'hasInitialized'], (prefs) => {
    if (prefs.hasInitialized && prefs.enabled) {
        observer.observe(document.body, { 
            childList: true, 
            subtree: true 
        });
    }
});

// Initial check after a short delay
setTimeout(() => {
    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }
}, 1000);

// Also initialize when YouTube's navigation occurs
document.addEventListener('yt-navigate-finish', initialize);
