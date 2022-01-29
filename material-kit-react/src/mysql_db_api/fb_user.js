const fb_user_url = process.env.REACT_APP_FB_USER_URL;

export const createFb_user = async (new_user) => {
  const res = await fetch(`${fb_user_url}/createuser`, {
    method: "POST",
    body: JSON.stringify(new_user),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const editFb_user = async (user, uid) => {
  const res = await fetch(`${fb_user_url}/edituser/${uid}`, {
    method: "PUT",
    body: JSON.stringify(user),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const deleteFb_user = async (uid) => {
  const res = await fetch(`${fb_user_url}/deleteuser/${uid}`, {
    method: "DELETE",
  });
  return res.json();
};

export const getUserByEmail = async (user_email) => {
  const res = await fetch(`${fb_user_url}/getonebyemail/${user_email}`);
  return res.json();
};

export const getUser = async (uid) => {
  const res = await fetch(`${fb_user_url}/getone/${uid}`);
  return res.json();
};
