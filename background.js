const YANDEX_API_KEY = 'trnsl.1.1.20200117T094544Z.d0fd57369f686e8b.eb37b0f7cc1474851217e8458f32bdb03ccdb3ab';
const TRANSLATE_LANG = 'ru';

browser.contextMenus.create({
    id: "translate",
    title: "Translate",
    contexts: ["selection"]
});


browser.contextMenus.onClicked.addListener((info, tab) => {
    console.log(info);
    if (info.menuItemId !== "translate") {
        return;
    }

    fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=${YANDEX_API_KEY}&lang=${TRANSLATE_LANG}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'text=' + encodeURIComponent(info.selectionText.trim()),
    }).then(response => {
        return response.json();
    })
    .then(data => {
        showTooltip(
            data.lang,
            data.text.join('')
        );
    }).catch(error => {
        console.error('Error:', error);
    });
});


function showTooltip(lang, text) {
    browser.notifications.create('translator', {
        type: "basic",
        iconUrl: "favicon.png",
        title: lang,
        message: text
    }).then(res => {
        // console.log('Success', res);
    }).catch(error => {
        console.error('Error:', error);
    });
}
