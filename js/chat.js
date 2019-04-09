const chat = {
    _ws : null,
    _messageRegex : /^#!(.+)#!: (.+)$/,

    initialize : function (cb) {
        chat._ws = new WebSocket('ws://127.0.0.1:55123');
        chat._ws.onopen = chat._onopen;
        chat._ws.onmessage = chat._onmessage;
        chat._ws.onerror = chat._onerror;
        chat._ws.onclose = chat._onclose;

        if (typeof cb == 'function') cb();
    },

    // --- Begin of WebSocket event handlers

    _onopen : function () {
        console.log('websocket open');

        const from = chat._getMyName();
        const text = 'Connected to the chat';
        const message = chat._prepareMessage(from, text);

        this.send(message);
    },

    _onmessage : function (event) {
        console.log('websocket onmessage');

        const message = chat._parseInputMessage(event.data);

        chat._addMessage(message.from, message.text);
    },

    _onerror : function () {
        console.log('error occurred!');
    },

    _onclose : function (event) {
        console.log('close code=' + event.code);
    },

    // --- End of WebSocket event handlers

    _parseInputMessage : function (message) {
        console.debug('_parseInputMessage; message', message);

        const match = chat._messageRegex.exec(message);
        console.debug('_parseInputMessage; match', match);

        return {
            from : match[1],
            text : match[2]
        };
    },

    show : function () {
        if (chat._ws == null) {
            chat.initialize(chat.onInitialized);
        } else {
            $('.chat').show();
        }
    },

    onInitialized : function () {
        chat.clearHistory();
        chat.show();
    },

    clearHistory : function () {
        $('.chat .message-list').html('');
    },

    _addMessage : function (from, text) {
        const isMe = from == chat._getMyName();
        const $message = chat._buildMessage(from, text, isMe);

        console.debug('_addMessage', from, text, isMe, $message);

        $message.appendTo('.chat .message-list');

        $("html, body").animate({ scrollTop: $(document).height() }, 1000);
    },

    _buildMessage : function (from, text, isMe, timestamp) {
        const $message = $($('.message-template').html()).clone();

        if ( ! timestamp)
            timestamp = chat._getCurrentTimestamp();

        $message.find('.message-sender').text(from);
        $message.find('.message-timestamp').text(timestamp);
        $message.find('.message-content').text(text);

        if (isMe) {
            $message.find('.message-sender').addClass('sender-me');
        }

        return $message;
    },

    _getCurrentTimestamp : function () {
        const dt = new Date();

        return `${dt.getHours()}:${dt.getMinutes()} ${('0' + dt.getDay()).slice(-2)}.${('0' + dt.getMonth()).slice(-2)}.${dt.getFullYear()}`;
    },

    sendMessage : function () {
        const text = chat._getMessageText();
        const from = localStorage.getItem('nickname');

        if ( ! text) {
            console.debug('empty message');
            return;
        }

        console.log('send message', from, text);

        const message = chat._prepareMessage(from, text);
        chat._ws.send(message);

        console.debug('websocket message sent');
        console.debug(message);

        chat._addMessage(from, text);

        chat._resetInput();
    },

    _resetInput : function () {
        $('.chat .message-input').val('');
    },

    _getMessageText : function () {
        return $('.chat .message-input').val().trim();
    },

    _prepareMessage : function (from, text) {
        return `#!${from}#!: ${text}`;
    },

    _getMyName : function () {
        return localStorage.getItem('nickname');
    },

    _onInputKeypress : function (event) {
        console.debug('_onInputKeypress', event);

        // Enter pressed
        if (event.keyCode == 13) {
            event.preventDefault();

            chat.sendMessage();
        }
    }
};