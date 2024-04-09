import { myFetchData } from "../Utils/apiUtils.js";

//Used for checking modules works as intended
export const logMessage = async () => {
  console.log("hello from logMessage in app.js");
  const endpoint = "https://iws.itcn.dk/techcollege/schedules?departmentcode=smed"; //Change the endpoint variable to the desired endpoint
  const data = await myFetchData(endpoint);
  console.log(data);
};
