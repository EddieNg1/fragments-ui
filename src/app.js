import { Auth, getUser } from './auth';
import { getUserFragments, postUserFragment } from './api';

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const fragmentSection = document.querySelector('#fragment');
  const addFragmentBtn = document.querySelector('#add-fragment');
  const content = document.querySelector("#content");
  const contentType = document.querySelector("#contentType");
  const getButton = document.querySelector("#get");
  const image = document.querySelector("#image")
  const getId = document.querySelector("#getId");
  const getById = document.querySelector("#getById");
  const getByIdInfo = document.querySelector("#getByIdInfo");
  const deleteId = document.querySelector("#deleteId");
  const deleteButton = document.querySelector("#delete");
  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };

  // See if we're signed in (i.e., we'll have a `user` object)
  const user = await getUser();
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }

  // Log the user info for debugging purposes
  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;
  fragmentSection.hidden = false;
  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;

  // Do an authenticated request to the fragments API server and log the result
  getButton.onclick = async () => {
    const data = await getUserFragments(user);
    fragments.innerHTML = "";
    data.fragments.forEach((element) => {
      const text = document.createTextNode(JSON.stringify(element));
      fragments.appendChild(text);
    });
  };

  addFragmentBtn.onclick = () => {
    if (
      contentType.options[contentType.selectedIndex].value == "text/plain" ||
      contentType.options[contentType.selectedIndex].value == "text/markdown" ||
      contentType.options[contentType.selectedIndex].value == "text/html" ||
      contentType.options[contentType.selectedIndex].value == "application/json"
    ){
      postUserFragment(user, contentType.options[contentType.selectedIndex].value, content.value);
    } else{
      postUserFragment(user, contentType.options[contentType.selectedIndex].value, image);
    }
  };

  getById.onclick = async () => {
    var res = await getFragment(user, getId.value);
    if(res[0].includes("application/json")){
      infoData.innerHTML = JSON.stringify(res[1]);
    }
    infoData.innerHTML = res;
  };

  getByIdInfo.onclick = async () => {
    var res = await getFragmentInfo(user, getId.value);
    infoData.innerHTML = JSON.stringify(res);
  };

  deleteButton.onclick = () => {
    deleteFragment(user, deleteId.value);
  };

}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);