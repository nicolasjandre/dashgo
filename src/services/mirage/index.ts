import { createServer, Model, Factory, Response, ActiveModelSerializer } from 'miragejs'
import { faker } from '@faker-js/faker';

type User = {
  name: string,
  email: string,
  created_at: string,
}

export function makeServer() {
  const server = createServer({
    serializers: {
      application: ActiveModelSerializer,
    },

    models: {
      user: Model.extend<Partial<User>>({})
    },

    factories: {
      user: Factory.extend({
        name() {
          return faker.name.fullName()
        },
        email() {
          return faker.internet.email().toLowerCase()
        },
        created_at() {
          return faker.date.recent(10, new Date())
        },
      })
    },

    seeds(server) {
      server.createList('user', 31)
    },

    routes() {
      this.passthrough('http://localhost:3333/**')
      this.namespace = 'api';
      this.timing = 750;

      this.get('/users', function (this: any, schema, request) {
        const { page = 1, per_page = 10 } = request.queryParams

        const total = schema.all('user').length

        const pageStart = (Number(page) - 1) * Number(per_page)
        const pageEnd = pageStart + Number(per_page)
        const users = this.serialize(schema.all('user'))
          .users
          .sort((a: User, b: User) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(pageStart, pageEnd);

        return new Response(200, { 'x-total-count': String(total) }, { users })
      }
      );
      this.patch('/users/:id')
      this.get('/users/:id')
      this.post('/users');
      this.namespace = ''
      this.passthrough()

      if (typeof window !== "undefined") {
        const NativeXMLHttpRequest = window.XMLHttpRequest;

        window.XMLHttpRequest = function XMLHttpRequest() {
          const request = new NativeXMLHttpRequest(arguments);
          delete request.onloadend;
          return request; // necessary for axios work with mirage passthrough
        }
      }
    }
  })
}