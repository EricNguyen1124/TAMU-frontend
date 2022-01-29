const members_url = process.env.REACT_APP_MEMBERS_URL;

export const getAllMembers = async () => {
  const res = await fetch(`${members_url}/getall`);
  return res.json();
};
export const getAllMembersWithoutAdmin = async () => {
  const res = await fetch(`${members_url}/getall_withoutadmin`);
  return res.json();
};

export const getOneMember = async (member_id) => {
  const res = await fetch(`${members_url}/getone/${member_id}`);
  return res.json();
};

export const getOneMemberByMail = async (mail) => {
  const res = await fetch(`${members_url}/getonebymail/${mail}`);
  return res.json();
};

export const addOneMember = async (new_member) => {
  const res = await fetch(`${members_url}/addone`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(new_member),
  });
  return res.json();
};

export const editOneMember = async (member_info, member_id) => {
  const res = await fetch(`${members_url}/editone/${member_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member_info),
  });
  return res.json();
};

export const updateProfile = async (member_info, member_id) => {
  const res = await fetch(`${members_url}/updateprofile/${member_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(member_info),
  });
  return res.json();
};

export const deleteOneMember = async (member_id) => {
  const res = await fetch(`${members_url}/deleteone/${member_id}`, {
    method: "DELETE",
  });
  return res.json();
};

// UPLOAD RESUME FOR MEMBERS
const resume_url = process.env.REACT_APP_RESUME_URL;

export const getResumeInfo = async (psid) => {
  const res = await fetch(`${resume_url}/getfile/${psid}`);
  return res.json();
};

export const uploadResume = async (psid, file) => {
  const formData = new FormData();
  formData.append("file", file);
  console.log(file);
  const res = await fetch(`${resume_url}/uploadfile/${psid}`, {
    method: "PUT",
    body: formData,
    headers: {
      Accept: "multipart/form-data",
    },
  });
  return res.json();
};

// PROFESSIONALS
const professionals_url = process.env.REACT_APP_PROFESSIONALS_URL;
// post for mmeber
export const addOneResumeSignUp = async (psid) => {
  const res = await fetch(`${professionals_url}/resume/${psid}`, {
    method: "POST",
  });
  return res.json();
};

export const addOneLinkedinSignUp = async (psid) => {
  const res = await fetch(`${professionals_url}/linkedin/${psid}`, {
    method: "POST",
  });
  return res.json();
};
export const addOneInterviewSignUp = async (psid) => {
  const res = await fetch(`${professionals_url}/interview/${psid}`, {
    method: "POST",
  });
  return res.json();
};

// get for member
export const getResumeSignUp = async (psid) => {
  const res = await fetch(`${professionals_url}/resume/${psid}`);
  return res.json();
};

export const getLinkedinSignup = async (psid) => {
  const res = await fetch(`${professionals_url}/linkedin/${psid}`);
  return res.json();
};

export const getInterviewSignup = async (psid) => {
  const res = await fetch(`${professionals_url}/interview/${psid}`);
  return res.json();
};

export const getCountResume = async () => {
  const res = await fetch(`${professionals_url}/count_resume/`);
  return res.json();
};

export const getCountMock = async () => {
  const res = await fetch(`${professionals_url}/count_mock/`);
  return res.json();
};

export const getCountLinkedin = async () => {
  const res = await fetch(`${professionals_url}/count_linkedin/`);
  return res.json();
};

// get all members for each professionals event

export const getMembersForResumeSignUp = async () => {
  const res = await fetch(`${professionals_url}/members_resume`);
  return res.json();
};

export const getMembersForLinkedinSignup = async () => {
  const res = await fetch(`${professionals_url}/members_linkedin`);
  return res.json();
};

export const getMembersForInterviewSignup = async () => {
  const res = await fetch(`${professionals_url}/members_interview`);
  return res.json();
};

// toggle is check for memeber in professionals
export const toggle_is_check = async (route, id) => {
  const res = await fetch(`${professionals_url}/${route}/${id}`, {
    method: "PUT",
  });
  return res.json();
};

// Set Joined Groupme
export const updateInGroupme = async (psid) => {
  const res = await fetch(`${members_url}/updateInGroupme/${psid}`, {
    method: "PUT",
  });
  return res.json();
};

// Set Shirt Pickup
export const updateGotShirt = async (psid) => {
  const res = await fetch(`${members_url}/updateGotShirt/${psid}`, {
    method: "PUT",
  });
  return res.json();
};
