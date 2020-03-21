const DEFAULTS = {
    key: 'trnsl.1.1.20200117T094544Z.d0fd57369f686e8b.eb37b0f7cc1474851217e8458f32bdb03ccdb3ab',
    lang: 'ru',
    voice: true
};

document.addEventListener('DOMContentLoaded', e => {
    const form = document.querySelector('form');

    browser.storage.sync.get(['key', 'lang', 'voice'])
        .then(options => {
            form.querySelector('#key').value = options.key || DEFAULTS.key;
            form.querySelector('#lang').value = options.lang || DEFAULTS.lang;
            form.querySelector('#voice').checked = 'voice' in options ? options.voice : DEFAULTS.voice;
        }).catch(error => {
            console.error('Error', error);
        });

    form.onsubmit = e => {
        browser.storage.sync.set({
            key: form.querySelector('#key').value,
            lang: form.querySelector('#lang').value,
            voice: form.querySelector('#voice').checked,
        }).then(result => {
            // console.log('Success', result);
        }).catch(error => {
            console.error('Error', error);
        });

        return false;
    };
});
