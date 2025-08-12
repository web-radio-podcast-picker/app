/*
    Sound card Oscilloscope | Signal Analyser Generator
    Copyright(C) 2025  Franck Gaspoz
    find license and copyright informations in files /COPYRIGHT and /LICENCE
*/

// math expression
class MathExpr {

    last = null
    nexts = {}
    dot = null

    init() {
        this.nexts[Kbd_Num] = [Kbd_Num, Kbd_Dot, Kbd_Op]
        this.nexts[Kbd_Dot] = [Kbd_Num]
        this.nexts[Kbd_Op] = [Kbd_Num, Kbd_Ch]
        this.nexts[Kbd_Ch] = [Kbd_Op]
        this.reset()
        return this
    }

    reset() {
        this.last = Kbd_Op
        this.dot = false
    }

    getNexts() {
        if (this.nexts[this.last] === undefined)
            return null
        const t = [...this.nexts[this.last]]
        if (this.dot) remove(t, Kbd_Dot)
        return t
    }

    setLast(expr) {
        this.last = expr
        if (expr == Kbd_Dot)
            this.dot = true
        if (expr == Kbd_Op || expr == Kbd_Ch)
            this.dot = false
    }
}
