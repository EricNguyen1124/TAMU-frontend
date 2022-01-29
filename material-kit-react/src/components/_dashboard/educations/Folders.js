import React from "react";
import { Button } from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";

export default function Folders({ childFolders, folderClick }) {
  return (
    <div style={{ paddingBottom: 10 }}>
      {childFolders.map((folder) => {
        return (
          <Button
            key={folder.id}
            variant="outlined"
            color="primary"
            size="large"
            style={{ marginRight: 10, marginBottom: 10 }}
            startIcon={<FolderIcon />}
            onClick={() => folderClick(folder.name, folder.id)}
          >
            {folder.name}
          </Button>
        );
      })}
    </div>
  );
}
