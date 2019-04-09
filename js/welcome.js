const welcome = {
    show : function (cb, timeout) {
        $('.welcome').show();

        setTimeout(cb, timeout);
    },
    hide : function () {
        $('.welcome').hide();
    }
};