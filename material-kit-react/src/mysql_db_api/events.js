const events_url = process.env.REACT_APP_EVENTS_URL;

export const getAllEvents = async () => {
  const res = await fetch(`${events_url}/getall`);
  return res.json();
};

export const getTodayEvent = async () => {
  const res = await fetch(`${events_url}/gettoday`);
  return res.json();
};

export const getThisWeekEvent = async () => {
  const res = await fetch(`${events_url}/getthisweek`);
  return res.json();
};

export const getNextWeekEvent = async () => {
  const res = await fetch(`${events_url}/getnextweek`);
  return res.json();
};


export const getThisWeekEvent_type = async (event_type) => {
  const res = await fetch(`${events_url}/getthisweek_event_type/${event_type}`);
  return res.json();
};

export const getOneEvent = async (event_id) => {
  const res = await fetch(`${events_url}/getone/${event_id}`);
  return res.json();
};

export const addOneEvent = async (new_event) => {
  const res = await fetch(`${events_url}/addone`, {
    method: "POST",
    body: JSON.stringify(new_event),
  });
  return res.json();
};

export const editOneEvent = async (event_info, event_id) => {
  const res = await fetch(`${events_url}/editone/${event_id}`, {
    method: "PUT",
    body: JSON.stringify(event_info),
  });
  return res.json();
};

export const deleteOneEvent = async (event_id) => {
  const res = await fetch(`${events_url}/deleteone/${event_id}`, {
    method: "DELETE",
  });
  return res.json();
};

// EVENTS ATTENDANCE
const url_event_att = process.env.REACT_APP_EVENT_ATT_URL;

export const checkinEvent = async (event_id, psid) => {
  const res = await fetch(`${url_event_att}/createone/${event_id}/${psid}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const checkEventExist = async (event_id, psid) => {
  const res = await fetch(`${url_event_att}/checkexist/${psid}/${event_id}`);
  return res.json();
};

// get events for memebr
export const getEventsForMember = async (psid) => {
  const res = await fetch(`${url_event_att}/getevents_for_member/${psid}`);
  return res.json();
};
// get members for a events
export const getMembersForEvent = async (psid) => {
  const res = await fetch(`${url_event_att}/getmembers_for_event/${psid}`);
  return res.json();
};

// delete user from the event
export const deleteMemberFromEvent = async (event_id, psid) => {
  const res = await fetch(`${url_event_att}/deleteone/${event_id}/${psid}`, {
    method: "DELETE",
  });
  return res.json();
};

export const getAllMembersToCheckin = async (event_id) => {
  const res = await fetch(`${url_event_att}/allmembers_check_att/${event_id}`);
  return res.json();
};
