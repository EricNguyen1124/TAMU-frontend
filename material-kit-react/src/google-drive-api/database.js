// DATABASE
const DATABASE_ROOT = process.env.REACT_APP_DATABASE_ROOT;
const url1 = process.env.REACT_APP_YOUTUBE_URL;

export const url = process.env.REACT_APP_DRIVE_URL;
// get child folders
export const getChildFolders = async (parentId) => {
  const res = await fetch(`${url}/folders/${parentId}`, {
    method: "GET",
  });
  return res.json();
};
// get child files
export const getChildFiles = async (parentId) => {
  const res = await fetch(`${url}/files/${parentId}`, {
    method: "GET",
  });
  return res.json();
};

export const getMeta = async (id) => {
  const res = await fetch(`${url}/meta/${id}`, {
    method: "GET",
  });
  return res.json();
};

export const seeFile = async (id, type) => {
  const res = await fetch(`${url}/watch/${id}/${type}`, {
    method: "GET",
  });
  return res.json();
};
// depreciated because it may take too long to get the list of parents
export const getParents = async (folderId) => {
  // return a list
  let listButton = [];
  let currentFolder = folderId;
  while (currentFolder !== DATABASE_ROOT) {
    const res = await getMeta(currentFolder);
    const parentId = res.data.parents[0];
    const name = res.data.name;
    currentFolder = parentId;
    console.log(name);
    listButton = [...listButton, { name: name, id: parentId }];
  }
  return [...listButton, "Database"];
};

// youtube api
const uploads_id = process.env.REACT_APP_YOUTUBE_UPLOADS_ID;
const channelId = process.env.REACT_APP_YOUTUBE_CHANNEL_ID;

export const getAllVideos = async () => {
  const res = await fetch(`${url1}/videos/${uploads_id}`);
  return res.json();
};

export const getAllPlaylist = async () => {
  const res = await fetch(`${url1}/playlist/${channelId}`);
  return res.json();
};

export const getVideoInPlaylist = async (playlistId) => {
  const res = await fetch(`${url1}/videos/${playlistId}`);
  return res.json();
};
