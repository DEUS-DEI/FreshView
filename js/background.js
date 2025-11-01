// This file contains listeners for background events which correspond to the
// following actions:
//
// 1. Activating the extension icon in the browser toolbar.
// 2. Processing keyboard shortcuts (and updating browser storage).
// 3. Notifying content scripts of changes to their tab URL.
// -----------------------------------------------------------------------------

/**
 * Processes keyboard shortcuts by modifying browser storage.
 *
 * @see https://developer.chrome.com/docs/extensions/reference/commands/#event-onCommand
 */
 function onCommandListener(command) {
    const toggleStateInBrowserStorage = (key, fallback) => {
        Storage.get({[key]: fallback}, values => Storage.set({[key]: !values[key]}));
    }

    if (command === "toggle-hide-videos-checkbox") {
        toggleStateInBrowserStorage(
            HIDE_VIDEOS_CHECKBOX_STORAGE_KEY,
            HIDE_VIDEOS_CHECKBOX_DEFAULT_STATE
        );

    } else if (command === "toggle-view-threshold-checkbox") {
        toggleStateInBrowserStorage(
            VIEW_THRESHOLD_CHECKBOX_STORAGE_KEY,
            VIEW_THRESHOLD_CHECKBOX_DEFAULT_STATE
        );
    }
};

/**
 * Activates the extension icon in the browser toolbar.
 *
 * @see https://developer.chrome.com/docs/extensions/reference/runtime/#event-onMessage
 */
function onMessageListener(message, sender, _sendResponse) {
    if (message.type === "showPageAction") {
        // In MV3 pageAction was replaced by action; enable the action for this tab.
        try {
            if (sender && sender.tab && sender.tab.id !== undefined) {
                chrome.action.enable(sender.tab.id);
            }
        } catch (e) {
            // Swallow errors in service worker context (best-effort)
            console.error("onMessageListener: failed to enable action:", e);
        }
    }
}

// Disable the action by default on install so it behaves like the old page_action
chrome.runtime.onInstalled.addListener(() => {
    try {
        chrome.tabs.query({}, (tabs) => {
            for (const t of tabs) {
                try { chrome.action.disable(t.id); } catch (e) { /* ignore */ }
            }
        });
    } catch (e) {
        console.error("onInstalled: failed to disable actions:", e);
    }
});

/**
 * Sends a message to a content script when the URL of its YouTube page changes.
 *
 * @see https://developer.chrome.com/docs/extensions/reference/tabs/#event-onUpdated
 */
function onTabUpdatedListener(tabID, changes, _){
    if (changes.url) {
        chrome.tabs.sendMessage(tabID, {"message": URL_CHANGE_MESSAGE});
    }
};

// -----------------------------------------------------------------------------

chrome.commands.onCommand.addListener(onCommandListener);
chrome.runtime.onMessage.addListener(onMessageListener);
chrome.tabs.onUpdated.addListener(onTabUpdatedListener);