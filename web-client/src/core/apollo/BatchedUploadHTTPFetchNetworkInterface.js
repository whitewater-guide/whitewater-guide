import {printAST} from 'apollo-client';
import {HTTPBatchedNetworkInterface} from 'apollo-client/transport/batchedNetworkInterface';
import RecursiveIterator from 'recursive-iterator';
import _ from 'lodash';

//Batch Uploader modified
//As described here: https://github.com/HriBB/apollo-upload-network-interface/issues/5
export class BatchedUploadHTTPFetchNetworkInterface extends HTTPBatchedNetworkInterface {
  constructor(uri, pollInterval, fetchOpts) {
    super(uri, pollInterval, fetchOpts);
  }

  query(request) {
    const formData = new FormData();

    // search for File objects on the request and set it as formData
    let hasFile = false;
    for (let {node, path} of new RecursiveIterator(request.variables)) {
      if (node instanceof File) {
        hasFile = true;
        const id = Math.random().toString(36);
        formData.append(id, node);
        _.set(request.variables, path.join('.'), id);
      }
    }

    if (hasFile){
      //This is query method from original network interface
      const options = { ...this._opts };

      return this
        .applyMiddlewares({request, options})
        .then((rao) => this.uploadQuery.call(this, rao, formData))
        .then(response => this.applyAfterwares({response, options}))
        .then(({ response }) => {
          const httpResponse = response;

          if (!httpResponse.ok) {
            const httpError = new Error(`Network request failed with status ${response.status} - "${response.statusText}"`);
            httpError.response = httpResponse;
            throw httpError;
          }

          return httpResponse.json();
        })
        .then((payload) => {
          if (!payload.hasOwnProperty('data') && !payload.hasOwnProperty('errors')) {
            throw new Error(
              `Server response was missing for query '${request.debugName}'.`,
            );
          } else {
            return payload;
          }
        });
    }
    else {
      // we just pass it through to the batcher.
      return this.batcher.enqueueRequest(request);
    }
  }

  uploadQuery({request, options}, formData) {
    formData.append('operationName', request.operationName);
    formData.append('query', printAST(request.query));
    formData.append('variables', JSON.stringify(request.variables || {}));

    return fetch(this._opts.uri, {
      ...options,
      body: formData,
      method: 'POST',
      headers: {
        Accept: '*/*',
        ...options.headers
      }
    });
  }
}

