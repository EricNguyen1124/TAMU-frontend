import React, { useState, useEffect } from "react";

import { Stack, Typography, Container } from "@material-ui/core";

// components
import Files from "./Files";
import DirectoriesHead from "./DirectoriesHead";
import Folders from "./Folders";
// apis
import { getChildFiles, getChildFolders } from "src/google-drive-api/database";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "src/authentication/AuthContext";

export default function EducationIndex() {
  const { folderId, title } = useParams();

  const [childFiles, setChildFilse] = useState([]);
  const [childFolders, setChildFolders] = useState([]);
  const [directory, setDirectory] = useState([{ name: title, id: folderId }]);

  useEffect(async () => {
    let folders = await getChildFolders(folderId);
    setChildFolders(folders.data);
    let files = await getChildFiles(folderId);
    setChildFilse(files.data);
  }, []);
  const { setLoading, displayErrMess } = useAuth();
  const folderClick = async (folderName, folderId) => {
    setLoading(true);
    const newButton = {
      name: folderName,
      id: folderId,
    };
    let folders = await getChildFolders(folderId);
    let files = await getChildFiles(folderId);
    if (folders.data && files.data) {
      setDirectory([...directory, { name: folderName, id: folderId }]);
      setChildFolders(folders.data);
      setChildFilse(files.data);
    } else {
      displayErrMess("Fail to Load files", "error");
    }
    setLoading(false);
  };

  const buttonFolderClick = async (folderId) => {
    setLoading(true);
    // cut off the parents list from the current to end

    const index = directory.findIndex((item) => {
      return item.id === folderId;
    });
    setDirectory(directory.slice(0, index + 1));

    let folders = await getChildFolders(folderId);
    let files = await getChildFiles(folderId);
    if (folders.data && files.data) {
      setChildFolders(folders.data);
      setChildFilse(files.data);
    } else {
      displayErrMess("Fail to load files!", "error");
    }
    setLoading(false);
  };

  return (
    <>
      <DirectoriesHead directory={directory} navigate={buttonFolderClick} />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h6">Folders</Typography>
      </Stack>
      <Folders childFolders={childFolders} folderClick={folderClick} />
      <Stack
        mb={2}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h6">Files</Typography>
      </Stack>
      <Files files={childFiles} />
    </>
  );
}
