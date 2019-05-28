import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { HttpHeaders } from '@angular/common/http';

const uri = 'http://services.iot.kupras.pl:8080/v1alpha1/graphql';

@NgModule({
  exports: [ApolloModule, HttpLinkModule]
})
export class GraphQLModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    const http = httpLink.create({uri});

    const auth = setContext(() => ({
        headers: new HttpHeaders().set('x-hasura-admin-secret', `Komputer997`)
    }));

    apollo.create({
      link: auth.concat(http),
      cache: new InMemoryCache()
    });
  }
}
