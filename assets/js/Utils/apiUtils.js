/**
 * 
 * @param {*} endpoint API URL 
 * @returns Array with data objects || data objects
 */

export const myFetchData = async (endpoint) => {
  let response = "";

  try {
    response = await fetch(endpoint);
    console.log(response);
    if (response.ok) {
      const json = await response.json();
      return json;
    }
  } catch (error) {
    console.error(`Error in fetch: ${error}`);
  }
};
