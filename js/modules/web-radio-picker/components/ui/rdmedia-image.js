/*
    Web Radio Podcast Picker
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

class RdMediaImage {

    constructor(
        imgId,
        paneId,
        noImgSrc,
        tabId,
        onImageUpdatedFunc
    ) {
        this.imgId = imgId
        this.paneId = paneId
        this.noImgSrc = noImgSrc
        this.tabId = tabId
        this.onImageUpdatedFunc = onImageUpdatedFunc
    }

    noImage() {
        const $i = $('#' + this.imgId)
        $i[0].src = this.noImgSrc
        $i.attr('data-noimg', '1')
        $i.attr('width', null)
        $i.attr('height', null)
        $i.attr('data-w', null)
        $i.attr('data-h', null)
    }

    resetImage() {
        const $i = $('#' + this.imgId)
        $i.attr('data-noimg', null)
        $i.attr('width', null)
        $i.attr('height', null)
        $i.attr('data-w', null)
        $i.attr('data-h', null)
        $i.addClass('ptransparent')
    }

    showImage() {
        const $i = $('#' + this.imgId)
        const noimg = $i.attr('data-noimg') != null
        if (noimg)
            $i.addClass('wrp-img-half')

        $i.removeClass('hidden')

        var iw = $i[0].width
        var ih = $i[0].height
        const dw = $i.attr('data-w')
        const dh = $i.attr('data-h')
        if (dw != null && dh != null) {
            // case: resize
            iw = dw
            ih = dh
        } else {
            $i.attr('data-w', iw)
            $i.attr('data-h', ih)
        }
        var r = iw / ih

        const $c = $('#' + this.paneId)
        const cw = $c.width()
        const ch = $c.height()
        var rw = iw / cw
        var rh = ih / ch

        // auto zoom
        if (!noimg) {
            iw *= 2
            ih *= 2
        }

        // limit bounds
        if (iw >= ih) {
            // square or landscape
            if (iw > cw) {
                iw = cw
                ih = iw / r
            }
            if (ih > ch) {
                ih = ch
                iw = r * ih
            }
        } else {
            // portrait
            if (ih > ch) {
                ih = ch
                iw = r * ih
            }
            if (iw > cw) {
                iw = cw
                ih = iw / r
            }
        }
        $i.attr('width', iw + 'px')
        $i.attr('height', ih + 'px')

        $i.removeClass('ptransparent')

        //this.ignoreNextShowImage = false

        if (!wrpp.resizeEventInitialized) {
            ui.onResize.push(() => {
                this.showImage()
            })
            wrpp.resizeEventInitialized = true
        }

        if ((!tabsController.preserveCurrentTab
            && !uiState.favoriteInputState) && this.tabId
        ) {
            tabsController
                .selectTab(this.tabId)
                .onTabChanged($('#' + this.tabId))
        }
        else
            tabsController.preserveCurrentTab = false
    }
}