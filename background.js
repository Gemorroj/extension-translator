const DEFAULTS = {
    key: 'trnsl.1.1.20200117T094544Z.d0fd57369f686e8b.eb37b0f7cc1474851217e8458f32bdb03ccdb3ab',
    lang: 'ru',
    voice: true
};

let speech = null;

browser.contextMenus.create({
    id: 'translate',
    title: 'Translate',
    contexts: ['selection']
});


browser.contextMenus.onClicked.addListener((info, tab) => {
    if ('translate' !== info.menuItemId) {
        return;
    }

    browser.storage.sync.get(['key', 'lang', 'voice']).then(options => {
        handleContextMenu(info.selectionText.trim(), {
            key: options.key || DEFAULTS.key,
            lang: options.lang || DEFAULTS.lang,
            voice: 'voice' in options ? options.voice : DEFAULTS.voice
        });
    }).catch(error => {
        console.error('Error', error);
    });
});


// https://github.com/mdn/webextensions-examples/issues/340
browser.notifications.onShown.addListener(id => {
    if ('translator' === id && speech) {
        setTimeout(() => speechSynthesis.speak(speech), 100); // timeout for lag
    }
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
        const langs = data.lang.split('-');
        showTooltip(
            text,
            langs[0],
            data.text.join(''),
            langs[1],
            options
        );
    }).catch(error => {
        console.error('Error', error);
    });
}


function showTooltip(sourceText, sourceLang, destText, destLang, options) {
    browser.notifications.create('translator', {
        type: 'basic',
        iconUrl: 'favicon.png',
        title: `${sourceLang} -> ${destLang}`,
        message: destText,
        // https://github.com/mdn/webextensions-examples/issues/340
        /*buttons: [
            {
                title: 'Speak',
                iconUrl: 'volume.svg',
            }
        ]*/
    }).then(result => {
        if (options.voice) {
            speech = new SpeechSynthesisUtterance(sourceText);
            speech.lang = sourceLang;
        }
        // console.log('Success', result);
    }).catch(error => {
        speech = null;
        console.error('Error', error);
    });
}
