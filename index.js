class EsWord {
    constructor(word, args, isArrayKeyWord = false) {
        if (isArrayKeyWord) {
            this.constructArray(word, args[0]);
        } else {
            this.constructObject(word, args);
        }
    }

    constructArray(word, args) {
        const body = args.map(arg => {
            if (arg instanceof EsWord) {
                return arg.compile();
            } else {
                return arg;
            }
        });

        this.word = word;
        this.body = body;
    }

    constructObject(word, args) {
        const body = args.reduce((acc, arg) => {
            if (arg instanceof EsWord) {
                return Object.assign(acc, arg.compile());
            } else {
                return Object.assign(acc, arg);
            }
        }, {});

        this.word = word;
        this.body = body;
    }

    compile() {
        return { [this.word]: this.body };
    }
}

const gumgum = {
    EsWord,
    body(...arg) {
        return new EsWord('body', arg, Array.isArray(arg[0]));
    },
    query(...arg) {
        return new EsWord('query', arg, Array.isArray(arg[0]));
    },
    filter(...arg) {
        return new EsWord('filter', arg, Array.isArray(arg[0]));
    },
    aggs(...arg) {
        return new EsWord('aggs', arg, Array.isArray(arg[0]));
    },
    global(...arg) {
        return new EsWord('global', arg, Array.isArray(arg[0]));
    },
    bool(...arg) {
        return new EsWord('bool', arg, Array.isArray(arg[0]));
    },
    multiMatch(...arg) {
        return new EsWord('multi_match', arg, Array.isArray(arg[0]));
    },
    must(...arg) {
        return new EsWord('must', arg, Array.isArray(arg[0]));
    },
    should(...arg) {
        return new EsWord('should', arg, Array.isArray(arg[0]));
    },
    mustNot(...arg) {
        return new EsWord('must_not', arg, Array.isArray(arg[0]));
    },
    range(...arg) {
        return new EsWord('range', arg, Array.isArray(arg[0]));
    },
    match(arg) {
        return new EsWord('match', [arg]);
    },
    key(k, ...arg) {
        return new EsWord(k, arg, Array.isArray(arg[0]));
    }
};

module.exports = gumgum;
