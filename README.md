#Gumgum

Gumgum is an Elastic Search query builder.

Example:
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

```

Output:

```json

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

Made with ♥ by Cubyn Team
