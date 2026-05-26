/* Service worker.
 *  - Click toolbar icon → tell content script to open the overlay.
 *  - If we're not on a Disney page, open the RopeDrop launchpad instead.
 */
chrome.action.onClicked.addListener((tab) => {
  if (!tab || !tab.id) return;
  chrome.tabs.sendMessage(tab.id, { type: "ropedrop:open" }).catch(() => {
    chrome.tabs.create({ url: "https://williamsdigital.io/preview/ropedrop/" });
  });
});
