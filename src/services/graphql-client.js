import React from 'react';
import ApolloClient from 'apollo-boost';
import { notification, Typography } from 'antd';

const { Paragraph } = Typography;

const client = new ApolloClient({
  uri: '/api/graphql',
  onError: ({ graphQLErrors }) => {
    graphQLErrors.forEach(({ extensions, message, path }) => {
      const { code } = extensions;
      const pathInfo = path.map((graphql, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Paragraph key={index}>graphQL请求——{graphql}</Paragraph>
      ));
      const error = (
        <>
          <Paragraph copyable>{message}</Paragraph>
          {pathInfo}
        </>
      );
      notification.error({
        description: error,
        message: code,
        duration: null,
      });
    });
  },
});

export default client;
