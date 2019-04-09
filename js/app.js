const app = {
    initialize : function () {
        console.log('app.initialize');
        document.addEventListener('DOMContentLoaded', app.onDeviceReady, false);
    },
    onDeviceReady : function () {
        console.log('app.onDeviceReady');
        welcome.show(function () {
            welcome.hide();

            const nickname = localStorage.getItem('nickname');
            settings.show(() => {
                settings.hide();
                chat.show();
            });
            // if (nickname) {
            //     chat.show();
            // } else {
            //     settings.show();
            // }
        }, 2000);
    }
};