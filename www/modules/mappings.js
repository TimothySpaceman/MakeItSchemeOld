
const statuses = {
    DEFAULT: 0,
    FIND_YES: 1,
    FIND_NO: 2,
    PACK_YES: 3,
    PACK_NO: 4
}

const keyCodes = {
    ctrl: 17,
    z: 90,
    y: 89
}

const directions = {
    UP: 1,
    DOWN: -1
}

const types = {
    "Початок": "start",
    "Кінець": "finish",
    "Вводимо": "input",
    "Виводимо": "output",
    "Виконуємо": "action",
    "Умова": "condition",
    "Так:": "yes",
    "Ні:": "no",
    "...": "end",

    includes: function() {
        Array.from(arguments).forEach(prop => {
            if (Object.getOwnPropertyNames(this).includes(prop)) {
                return true
            }
        })
    }
}

mappings = {
    statuses,
    keyCodes,
    types
}
