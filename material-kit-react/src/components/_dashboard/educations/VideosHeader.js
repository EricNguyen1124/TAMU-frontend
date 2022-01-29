import React from "react";
import { Stack, Typography, Button } from "@material-ui/core";
import VideoSearchBox from "./VideoSearchBox";
// import POSTS from "src/_mocks_/blog";
import VideoSortPlaylist from "./VideoSortPlaylist";

// const SORT_OPTIONS = [
//   { value: "latest", label: "Latest" },
//   { value: "popular", label: "Popular" },
//   { value: "oldest", label: "Oldest" },
// ];
export default function VideosHeader({
  sort_options,
  videos,
  getSortedVideo,
  option,
  setOption,
  onSearchKey,
  searchKey,
}) {
  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mt={5}
      >
        {/* <Typography variant="h6" gutterBottom>
          Videos
        </Typography> */}
      </Stack>

      <Stack
        mb={5}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <VideoSearchBox
          // posts={videos}
          onSearchKey={onSearchKey}
          searchKey={searchKey}
        />
        <VideoSortPlaylist
          options={sort_options}
          option={option}
          setOption={setOption}
        />
      </Stack>
    </>
  );
}

// sor t by playlist
