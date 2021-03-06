function getExtFromPath(path) {
    return path.substr((~-path.lastIndexOf('.') >>> 0) + 2);
}

let _files = null;

function getAllFiles() {
    if (_files) {
        return _files;
    } else {
        const files = [];
        $('.file-header').each(function (n, header) {
            const $header = $(header);
            const path = $header.data('path');
            const e = getExtFromPath(path);

            $header.data('ext', e);
            files.push(path);
        });

        _files = files;
    }
    return _files;
}

function getAllExtensions() {
    const files = getAllFiles();
    const ext = {};

    files.forEach(function (file) {
        const e = getExtFromPath(file);
        if (!ext[e]) {
            ext[e] = 1;
        } else {
            ext[e]++;
        }
    });

    return ext;
}

function getSelectedExt() {
    const ext = [];

    $('#extensions a.selected').each(function (n, a) {
        ext.push($(a).data('ext'));
    });

    return ext;
}

function createExtButtons() {
    const buttonsConfig = getAllExtensions();
    const ext = Object.keys(buttonsConfig).sort();
    let $buttons;
    let html = '';

    html += '<div class=""><div id="extensions" class="btn-group clearfix">';

    ext.forEach(function (e) {
        let ee = e;
        if (!ee) {
            ee = 'none';
        } else {
            ee = '.' + ee;
        }
        html += `<a data-ext='${e}' class='btn btn-sm BtnGroup-item js-ext-filter  selected' href='#'>${ee} (${buttonsConfig[e]})</a>`;
    });

    html += '</div></div>';

    $('#extensions').remove();

    $buttons = $(html).insertAfter($('.pr-toolbar').first());

    $buttons
        .on('click', '.js-ext-filter', function (e) {
            e.preventDefault();
            $(this).toggleClass('selected');
            filterFiles(getSelectedExt());
        })
        .css('margin-bottom', '20px');
}

function filterFiles(fileTypes) {
    $('.file-header').each(function (n, header) {
        const $header = $(header);
        const ext = $header.data('ext');

        $header.parent('.file').toggle(fileTypes.indexOf(ext) !== -1);

    });
}

function check_ui_is_ready() {
    const totalFileExpected = parseInt($('#files_tab_counter').html());
    const totalFileLoaded = $('.file-header').length;
    
    if (totalFileExpected === totalFileLoaded) {
        activateExtUi();
    } else {
        wait_a_bit();
    }
}

function wait_a_bit() {
    setTimeout(function () {
        check_ui_is_ready();
    }, 100);
}

function activateExtUi() {
    createExtButtons();
    filterFiles(getSelectedExt());
}

check_ui_is_ready();
