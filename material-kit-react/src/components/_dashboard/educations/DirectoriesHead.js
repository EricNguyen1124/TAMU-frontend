import React from "react";
import { Stack, Typography, Button } from "@material-ui/core";

export default function DirectoriesHead({ directory, navigate }) {
  return (
    <>
      {directory.map((button) => (
        <Button
          key={button.id}
          style={{ padding: 0, margin: 0 }}
          onClick={() => navigate(button.id)}
        >
          {button.name}/
        </Button>
      ))}
    </>
  );
}
