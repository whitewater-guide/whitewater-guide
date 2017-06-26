import { printAST } from 'apollo-client';
import { HTTPBatchedNetworkInterface } from 'apollo-client/transport/batchedNetworkInterface';
import { HTTPFetchNetworkInterface, BaseNetworkInterface } from 'apollo-client/transport/networkInterface';
import RecursiveIterator from 'recursive-iterator';
import set from 'lodash/fp/set';

// Batch Uploader modified
// As described here: https://github.com/HriBB/apollo-upload-network-interface/issues/5
export class BatchedUploadHTTPFetchNetworkInterface extends BaseNetworkInterface {

  constructor(uri, batchInterval, fetchOpts) {
    super(uri, fetchOpts);
    this.batchedInterface = new HTTPBatchedNetworkInterface({ uri, batchInterval, fetchOpts });
    this.uploadInterface = new HTTPFetchNetworkInterface(uri, fetchOpts);
    this.uploadInterface.fetchFromRemoteEndpoint = this.uploadQuery;
  }

  query(request) {
    this.uploadInterface.formData = new FormData();

    // search for File objects on the request and set it as formData
    let hasFile = false;
    for (let { node, path } of new RecursiveIterator(request.variables)) {
      if (node instanceof File) {
        hasFile = true;
        const id = Math.random().toString(36);
        this.uploadInterface.formData.append(id, node);
        request.variables = set(path.join('.'), id)(request.variables);
      }
    }

    if (hasFile) {
      return this.uploadInterface.query(request);
    }
    return this.batchedInterface.query(request);
  }

  uploadQuery({ request, options }) {
    const formData = this.formData;
    this.formData = null;
    formData.append('operationName', request.operationName);
    formData.append('query', printAST(request.query));
    formData.append('variables', JSON.stringify(request.variables || {}));
    return fetch(this._uri, {
      ...options,
      body: formData,
      method: 'POST',
      headers: {
        Accept: '*/*',
        ...options.headers,
      },
    });
  }

  use(middlewares) {
    this.batchedInterface.use(middlewares);
    this.uploadInterface.use(middlewares);
  }

  useAfter(afterwares) {
    this.batchedInterface.useAfter(afterwares);
    this.uploadInterface.useAfter(afterwares);
  }
}
