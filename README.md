#Gumgum

Gumgum is an Elastic Search query builder.

##Example Usage

Simple example

```javascript
const g = require('gumgum')

const query = g.query(
    g.must(
        g.match({ type: 'rabbit' })
    ),
    g.mustNot([
        g.match({ color: 'green' }),
        g.match({ color: 'red' })
    ]),
    g.key('color',
        g.filter(g.bool(
            g.must([
                g().query.bool.should.match({ name: 'carotte' })
            ])
        ))
    )
)

console.log(g.compile())

// output:

{
  "query": {
    "must": {
      "match": {
        "type": "rabbit"
      }
    },
    "must_not": [
      {
        "match": {
          "color": "green"
        }
      },
      {
        "match": {
          "color": "red"
        }
      }
    ],
    "color": {
      "filter": {
        "bool": {
          "must": [
            {
              "query": {
                "bool": {
                  "should": {
                    "match": {
                      "name": "carotte"
                    }
                  }
                }
              }
            }
          ]
        }
      }
    }
  }
}

```

##Contributing

Fork it ( https://github.com/cubyn/gumgum/fork )
Create your feature branch (git checkout -b my-new-feature)
Commit your changes (git commit -am 'Add some feature')
Push to the branch (git push origin my-new-feature)
Create a new Pull Request

----------

Made with ♥ by Cubyn Team
