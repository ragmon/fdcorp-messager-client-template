const settings = {
    _cb : null,

    show : function (cb) {
        settings._cb = cb;

        $('.chat-settings').show();
    },

    hide : function () {
        $('.chat-settings').hide();
    },

    clearForm : function () {
        $('.chat-settings-form')[0].reset();
    },

    _formValidation : function (data) {
        if ( !(data['nickname'].length >= 1 && data['nickname'].length <= 16) ) {
            throw 'Nickname must be set and contains >= 1 or <= 16 symbols.';
        }
    },

    onSubmit : function () {
        const nickname = $('.chat-settings-form input[name=nickname]').val().trim();

        try {
            settings._formValidation({ nickname });
        } catch (e) {
            $('.chat-settings .chat-settings-form .alert').text(e).show();
            return;
        }

        localStorage.setItem('nickname', nickname);

        settings.clearForm();

        if (typeof settings._cb == 'function') {
            settings._cb();
        }
    }
};