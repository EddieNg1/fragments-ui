// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || 'http://localhost:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user) {
  console.log('Requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments?expand=1`, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments data', { data });
    return data;
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}

export async function postUserFragment(user, type, content) {
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.idToken}`,
        "Content-Type": `${type}`
      },
      body: `${content}`,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Posted user fragments data', { data });
  } catch (err) {
    console.error("Unable to call POST /v1/fragment", { err });
  }
}

export async function getFragment(user, id) {
  console.log(`Getting fragment by ID: ${id}`);
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const headers = res.headers.get("content-type");
    var data;
    if (headers.includes("text/plain")) {
      data = await res.text();
    } else if (headers.includes("application/json")) {
      data = await res.text();
    } else if (headers.includes("text/html")) {
      data = await res.text();
    } else if (headers.includes("image/")){
      data = await res.blob();
    }else{
      data = await res.text();
    }
      console.log("Got user fragments by id", { data });
      return[headers, data];
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}

export async function getFragmentInfo(user, id) {
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}/info`, {
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log("GET user fragments data", { data });
    return data;
  } catch (err) {
    console.error("Unable to call GET /v1/fragment", { err });
  }
}

export async function deleteFragment(user, id) {
  console.log(`Deleting fragment by Id: ${id}`);
  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const dat = await res.json();
    console.log("Delete fragments data", { dat });
    return dat;
  } catch (err) {
    console.error("Unable to call DELETE /v1/fragment", { err });
  }
}