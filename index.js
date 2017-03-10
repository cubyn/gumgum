// dependecies
const camelcase = require('camelcase');

// available keywords for search
const keyWords = ['body', 'query', 'filter', 'term', 'aggs', 'global', 'bool',
'multi_match', 'must', 'filtered', 'should', 'must_not', 'range', 'match'];


class EsWord {
    // called when we use g[something](...args)
    // something is the word arguments
    // and args is the list of arguments given to the something function
    constructor(word, args, isArrayKeyWord = false) {
        if (isArrayKeyWord) {
            this.parseArray(word, args[0]);
        } else {
            this.parseObject(word, args);
        }
    }

    // g.must([{ key: 'a' }, { key: 'b' }])
    // out
    // { "must": [{ key: 'a' }, { key: 'b' }] }
    parseArray(word, args) {
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

    // g.must({ key: 'a' }, { key2: 'b' })
    // out
    // { "must": { key: 'a', key2: 'b' } }
    parseObject(word, args) {
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

    // return the elastic query as a js object
    compile() {
        return { [this.word]: this.body };
    }
}

// gumgum start a chain if called directly
function gumgum() {

    // ctx is used to save and to end the chain
    const ctx = function (arg) {
        return {
            compile() {
                // bubble up the chain
                let dest = arg;

                ctx.chain.forEach(elem => {
                    dest = { [elem]: dest };
                });

                return dest;
            }
        }
    };

    // the chain
    ctx.chain = [];

    // for each available elastic keywords create a getter
    keyWords.forEach(kw => {
        Reflect.defineProperty(ctx, camelcase(kw), {
            get() {
                ctx.chain.unshift(kw);
                return ctx;
            }
        });
    });

    return ctx;
}

keyWords.forEach(kw => {
    gumgum[camelcase(kw)] = function (...arg) {
        return new EsWord(kw, arg, Array.isArray(arg[0]));
    };
});

gumgum.key = function (k, ...arg) {
    return new EsWord(k, arg, Array.isArray(arg[0]));
}

module.exports = gumgum;
