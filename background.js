browser.contextMenus.create({
    id: 'translate',
    title: 'Translate',
    contexts: ['selection']
});


browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId !== 'translate') {
        return;
    }

    browser.storage.sync.get(['key', 'lang']).then(options => {
        handleContextMenu(options, info.selectionText.trim());
    }).catch(error => {
        console.error('Error', error);
    });
});


function handleContextMenu(options, text) {
    fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${options.key}&lang=${options.lang}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'text=' + encodeURIComponent(text),
    }).then(response => {
        return response.json();
    }).then(data => {
        showTooltip(
            data.lang,
            data.text.join('')
        );
    }).catch(error => {
        console.error('Error', error);
    });
}


function showTooltip(lang, text) {
    browser.notifications.create('translator', {
        type: 'basic',
        iconUrl: 'favicon.png',
        title: lang,
        message: text
    }).then(result => {
        // console.log('Success', result);
    }).catch(error => {
        console.error('Error', error);
    });
}
