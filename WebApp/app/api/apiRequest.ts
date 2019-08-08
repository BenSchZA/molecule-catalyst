export enum RequestMethod {
  GET = 'GET',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
}

const apiRequest = async (method: RequestMethod, url: string, body?: any, contentType?, authenticate = false, token?) => {
  const options = {
    method: method,
    body: body,
    headers: {},
  };
  
  if (!body) {
    delete options.body;
  }

  if (authenticate) {
    if (!token) { throw new Error('No Authentication token provided'); }
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (contentType) {
    options.headers['Content-Type'] = contentType;
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Authentication Error');
    } else {
      throw new Error('Failed to fetch');
    }
  }

  const responseContentType = response.headers.get('Content-Type') || '';

  const isJson = responseContentType.includes('application/json');

  const result = {
    success: true,
    response: response,
    data: isJson ? await response.json() : await response.arrayBuffer(),
  };

  return result;
};

export default apiRequest;
