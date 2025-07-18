// bindings

class Bindings {

    bindings = []           // array of bindings for controls

    initBindedControls() {
        // Initialize bindings for UI controls
        this.bindings.forEach(b => {
            if (b.init != null)
                b.init();
        });
        app.updateDisplay()
    }

    binding(controlId, valuePath, t) {
        const r = {
            controlId: controlId,
            valuePath: valuePath,
            sym: null,
            onChanged: null,
            onPostChanged: null,
            onInit: null,
            readOnly: false,
            unit: '',
            attr: 'value',
            digits: 5,
            input: {
                delta: 1,
                min: 0,
                max: null
            }
        };
        const res = t = null ? r : { ...r, ...t };
        if (res.input.min == null)
            res.input.min = 0;
        return res;
    }

    bind(binding) {
        const { controlId, valuePath, sym, onChanged, onPostChanged, onInit, readOnly, unit, attr, digits } = binding;
        if (readOnly == null)
            readOnly = false;
        const $c = $('#' + controlId);

        if (readOnly) {
            $c.addClass('read-only');
            $c.attr('readonly', '');
        } else {
            // input widget
            $c.on('click', () => {
                ui.inputWidgets.openInputWidget(controlId);
            })
        }

        const t = this;
        const init = ($ctrl) => {
            const $o = $c;
            if ($ctrl == null) $ctrl = $o;
            // initial value
            if (onInit == null) {
                try {
                    const v = eval(valuePath) + unit;
                    if (attr == 'text')
                        $ctrl.text(v)
                    else
                        $ctrl.attr(attr, v);
                    $ctrl.val(v);
                    $ctrl.attr('data-inival', v);
                    binding.input.value = v
                } catch (err) {
                    // ignore or debug
                    if (settings.debug.debug)
                        console.log(valuePath, err)
                }
            }
            else
                onInit();
        }
        app.addOnStartUI(() => {
            init($c);
        })

        var onChange = () => {
            const v = $c.val();
            const s = (sym == null)
                ? '' : sym;
            if (onChanged != null)
                onChanged();
            else {
                try {
                    eval(valuePath + '=' + s + v + s);
                    if (onPostChanged != null)
                        onPostChanged(v)
                } catch (err) {
                    // ignore or debug
                    if (settings.debug.debug)
                        console.log(err)
                }
            }
            app.updateDisplay();
        }

        this.initBindedControls()

        if (!readOnly) {
            $c.on('change', () => {
                onChange();
            });
        }

        this.bindings.push({ init: init, onChange: onChange, props: binding });
        return ui
    }

    getBinding(controlId) {
        var r = null;
        this.bindings.forEach(b => {
            if (b.props.controlId == controlId) {
                r = b;
            }
        });
        return r;
    }

    updateBindingSourceAndTarget(controlId, value) {
        const binding = this.getBinding(controlId);
        const $c = $('#' + controlId);
        $c.attr('value', value);
        $c.attr('data-inival', value);
        $c.val(value);
        binding.onChange();
    }
}