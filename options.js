const DEFAULTS = {
    key: 'trnsl.1.1.20200117T094544Z.d0fd57369f686e8b.eb37b0f7cc1474851217e8458f32bdb03ccdb3ab',
    lang: 'ru'
};

document.addEventListener('DOMContentLoaded', e => {
    const form = document.querySelector('form');

    browser.storage.sync.get(['key', 'lang'])
        .then(result => {
            form.querySelector('input[name="key"]').value = result.key || DEFAULTS.key;
            form.querySelector('select[name="lang"]').value = result.lang || DEFAULTS.lang;
        }).catch(error => {
            console.error('Error', error);
        });

    form.onsubmit = e => {
        browser.storage.sync.set({
            key: form.querySelector('input[name="key"]').value,
            lang: form.querySelector('select[name="lang"]').value,
        }).then(result => {
            // console.log('Success', result);
        }).catch(error => {
            console.error('Error', error);
        });

        return false;
    };
});
