/* Click the toolbar icon → ask the content script to open the overlay. */
chrome.action.onClicked.addListener((tab) => {
  if (!tab || !tab.id) return;
  chrome.tabs.sendMessage(tab.id, { type: "ropedrop:open" }).catch(() => {
    /* If we're not on a Disney page, just open the launchpad. */
    chrome.tabs.create({ url: "https://williamsdigital.io/preview/ropedrop/" });
  });
});
