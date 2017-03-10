const camelcase = require('camelcase');
const keyWords = ['body', 'query', 'filter', 'term', 'aggs', 'global', 'bool',
'multi_match', 'must', 'filtered', 'should', 'must_not', 'range', 'match'];

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

function gumgum() {
    const ctx = function (arg) {
        return {
            compile() {
                const stack = ctx.chain.reverse();
                let dest = arg;

                stack.forEach(elem => {
                    dest = { [elem]: dest };
                });

                return dest;
            }
        }
    };

    ctx.chain = [];

    keyWords.forEach(kw => {
        Reflect.defineProperty(ctx, camelcase(kw), {
            get() {
                ctx.chain.push(kw);
                return ctx;
            }
        })
    });

    return ctx;
}

keyWords.forEach(kw => {
    if (kw === 'must') {
        gumgum[kw] = function (...arg) {
            return new EsWord(kw, [arg]);
        };
    } else {
        gumgum[camelcase(kw)] = function (...arg) {
            return new EsWord(kw, arg, Array.isArray(arg[0]));
        };
    }
});

gumgum.key = function (k, ...arg) {
    return new EsWord(k, arg, Array.isArray(arg[0]));
}

module.exports = gumgum;
