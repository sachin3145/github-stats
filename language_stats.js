import "dotenv/config"

/**
 * @param {string} username username of account whose details need to be compiled
 * @param {string} authToken bearer token for authorization
 * @returns object containing key value pair of language and its usage extent in percentage
 */
export default async function languageStats(username, authToken) {
  // internal variables 
  let repositories = [];
  let languages = {};
  let total = 0;

  // metadata for API requests
  var myHeaders = new Headers();
  myHeaders.append("Authorization", authToken);

  var requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow",
  };

  // collecting repository names
  try {
    let response = await fetch(`https://api.github.com/users/${username}/repos`, requestOptions)
    let result = await response.json();
    if(result.length) result.forEach((element) => repositories.push(element.name));
  }
  catch (error) {
    console.log(error);
  }
  
  // collecting languages used in recorded repositories
  try {
    for (let i = 0; i < repositories.length; ++i){
      let response = await fetch(`https://api.github.com/repos/${username}/${repositories[i]}/languages`, requestOptions)
      let result = await response.json();
      for (const [key, value] of Object.entries(result)) {
        total += value;
        if (languages[key]) languages[key] += value;
        else languages[key] = value;
      }
    }
  }
  catch (error) {
    console.log(error);
  }

  for (const [key, value] of Object.entries(languages)) {
    languages[key] = (value * 100) / total;
  }
    
  return languages;  
}

languageStats(process.env.ACCOUNT, process.env.SECRET).then(res => console.log(res));