import { printAST } from 'apollo-client';
import { HTTPFetchNetworkInterface } from 'apollo-client/transport/networkInterface';
import RecursiveIterator from 'recursive-iterator';
import _ from 'lodash';

// As described here: https://github.com/HriBB/apollo-upload-network-interface/issues/5
class UploadHTTPFetchNetworkInterface extends HTTPFetchNetworkInterface {
  constructor(...args) {
    super(...args);

    const normalQuery = this.fetchFromRemoteEndpoint.bind(this);

    this.fetchFromRemoteEndpoint = ({ request, options }) => {
      const formData = new FormData();

      // search for File objects on the request and set it as formData
      let hasFile = false;
      for (let { node, path } of new RecursiveIterator(request.variables)) {
        if (node instanceof File) {
          hasFile = true;
          const id = Math.random().toString(36);
          formData.append(id, node);
          _.set(request.variables, path.join('.'), id);
        }
      }

      if (hasFile) {
        return this.uploadQuery({ request, options }, formData);
      }
      return normalQuery({ request, options });
    };
  }

  uploadQuery({ request, options }, formData) {
    formData.append('operationName', request.operationName);
    formData.append('query', printAST(request.query));
    formData.append('variables', JSON.stringify(request.variables || {}));

    return fetch(this._opts.uri, {
      ...options,
      body: formData,
      method: 'POST',
      headers: {
        Accept: '*/*',
        ...options.headers,
      },
    });
  }
}

export default function createNetworkInterface(opts) {
  const { uri } = opts;
  return new UploadHTTPFetchNetworkInterface(uri, opts);
}

