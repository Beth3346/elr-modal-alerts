import elrUI from 'elr-ui';
const $ = require('jquery');

let ui = elrUI();

const elrModalAlert = function({
    alertClass = 'elr-modal-alert',
    speed = 300
} = {}) {
    const self = {
        addButtons(buttons, $el) {
            ui.each(buttons, function() {
                const $button = ui.createElement('button', {
                    class: this.class,
                    text: this.text
                }).appendTo($el);

                if (this.onClick) {
                    $button.on('click', this.onClick)
                } else {
                    $button.on('click', function() {
                        self.clearAlert.call(this);
                    });
                }
            });
        },
        showAlert({
            type = 'info',
            title = 'An Alert',
            text = 'This is some info about the alert.',
            closeOnClick = true,
            buttons = {
                infoButton: {
                    type: 'info',
                    text: 'Dismiss',
                    class: 'elr-button elr-button-info'
                }
            }
        } = {}) {
            const $body = $('body');
            const className = `${alertClass} elr-${type}-modal-alert`;
            let iconClass = null;

            if (type === 'success') {
                iconClass = 'fa fa-check';
            } else if (type === 'info') {
                iconClass = 'fa fa-info';
            }

            const $newAlert = ui.createElement('div', {
                class: className
            });

            const $alertHeader = ui.createElement('div', {
                html: `<p class="elr-modal-alert-heading"><i class="${iconClass}"></i> ${title}</p>`,
                class: 'elr-header'
            });

            const $alertBody = ui.createElement('div', {
                html: `<p>${text}</p>`,
                class: 'elr-body'
            });

            const $alertFooter = ui.createElement('div', {
                class: 'elr-footer'
            });

            const $close = ui.createElement('button', {
                text: 'x',
                class: 'close'
            });

            const $lightbox = ui.createElement('div', {
                class: 'elr-blackout'
            });

            $lightbox.hide().appendTo('body').fadeIn(speed, function() {
                $close.appendTo($lightbox);
                $newAlert.appendTo($lightbox);
                $alertHeader.appendTo($newAlert);
                $alertBody.appendTo($newAlert);
                $alertFooter.hide().appendTo($newAlert).fadeIn(0, function() {
                    const $that = $(this);

                    if (Object.keys(buttons).length === 1) {
                        $that.addClass('single-action');
                    }

                    self.addButtons(buttons, $that);
                });

                if (closeOnClick) {
                    $('.elr-blackout').on('click', function() {
                        $(this).find($(`.${alertClass}`))
                               .fadeOut(speed, function() {
                            ui.clearElement($('.elr-blackout'), 100);
                            ui.clearElement($(this), 0);
                        });
                    });

                    $(`.${alertClass}`).on('click', function(e) {
                        e.stopPropagation();
                    });
                }
            });
        },

        clearAlert(speed = speed, cb = null) {
            $(this).closest(`.${alertClass}`).fadeOut(speed, function() {
                ui.clearElement($('.elr-blackout'), 100);
                ui.clearElement($(this), 0);

                if (cb) {
                    cb();
                }
            });
        }
    };

    // const $alerts = $(`.${alertClass}`);

    $('body').on('click', `.${alertClass} button.close`, function(e) {
        e.preventDefault();
        self.clearAlert(speed);
    });

    return self;
};

export default elrModalAlert;