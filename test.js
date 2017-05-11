const { expect } = require('chai');
const g = require('.');

describe('Gumgum', () => {
    it('Must work', () => {
        const nin = g.must({ hello: 'world' });

        expect(nin.compile()).to.deep.equal({ must: { hello: 'world' } });
    });

    it('must handle results of other gumgum functions', () => {
        const nin = g.must(g.should({ hello: 'world' }));

        expect(nin.compile()).to.deep.equal({ must: { should: { hello: 'world' } } });
    });

    it('Multiple params', () => {
        const nin = g.must(
            g.should({ hello: 'world' }),
            g.mustNot({ say: 'hello' })
        );

        expect(nin.compile()).to.deep.equal({
            must: {
                should: { hello: 'world' },
                must_not: { say: 'hello' },
            }
        });
    });

    it('argument of type array', () => {
        const obj = [{ hello: 'world' }];
        const nin = g.should(obj);

        expect(nin.compile()).to.deep.equal({ should: obj });
    });

    it('argument of type array with a length > 1', () => {
        const obj = [{ hello: 'world' }, { salut: 'bonjour' }]
        const nin = g.should(obj);

        expect(nin.compile()).to.deep.equal({ should: obj });
    });

    it('chains', () => {
        const obj = { hello: 'world' };
        const nin = g().should.bool.must(obj);

        expect(nin.compile()).to.deep.equal({
            should: { bool: { must: obj } }
        });
    });


    it('Work with complex query', () => {
        const res = ['123', '234']
            .map(type => g().query.bool(
                g().must.match({ type }),
                g.mustNot([
                    g.match({ status: 'created' }),
                    g.match({ status: 'terminated' })
                ])
            ).compile());

        expect(res).to.deep.equal([{
            query: {
                bool: {
                    must: { match: { type: '123' } },
                    must_not: [
                        { match: { status: 'created' } },
                        { match: { status: 'terminated' } }
                    ]
                }
            }
        }, {
            query: {
                bool: {
                    must: { match: { type: '234' } },
                    must_not: [
                        { match: { status: 'created' } },
                        { match: { status: 'terminated' } }
                    ]
                }
            }
        }]);
    });
});
