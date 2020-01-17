const DEFAULTS = {
    key: 'trnsl.1.1.20200117T094544Z.d0fd57369f686e8b.eb37b0f7cc1474851217e8458f32bdb03ccdb3ab',
    lang: 'ru'
};


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
        handleContextMenu(info.selectionText.trim(), {
            key: options.key || DEFAULTS.key,
            lang: options.lang || DEFAULTS.lang
        });
    }).catch(error => {
        console.error('Error', error);
    });
});


function handleContextMenu(text, options) {
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
