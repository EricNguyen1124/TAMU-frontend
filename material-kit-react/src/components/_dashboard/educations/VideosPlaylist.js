import { Grid } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Video from "./Video";
import VideosHeader from "./VideosHeader";


// imporrt apis
import {
  getAllVideos,
  getAllPlaylist,
  getVideoInPlaylist,
} from "src/google-drive-api/database";
import { filter } from "lodash";

function applyFilter(array, query) {
  return filter(
    array,
    (_user) =>
      _user.snippet.title.toLowerCase().indexOf(query.toLowerCase()) !== -1
  );
}
export default function VideosPlaylist() {

  const init_option = {
    label: "All Videos",
    value: "All Videos",
    id: process.env.REACT_APP_YOUTUBE_UPLOADS_ID,
  };
  const [videos, setVideos] = useState([]);
  const [sort_options, setOptions] = useState([init_option]);
  const [option, setOption] = useState(init_option);
  useEffect(async () => {
    let videos_data = await getAllVideos();
    let options_data = await getAllPlaylist();
    console.log(videos_data, options_data);
    if (videos_data.data && options_data.data) {
      setVideos(videos_data.data);
      const sort_options_ = getPlaylistTitle(options_data.data);
      const all_sort_options = [...sort_options, ...sort_options_];
      setOptions(all_sort_options);
    }
  }, []);

  useEffect(async () => {
    let videos_data = await getVideoInPlaylist(option.id);
    if (videos_data.data) {
      setVideos(videos_data.data);
    }
  }, [option]);

  // function getSearchVdieo(name ){
  //   const searchREsult = videos.filter(video=>{
  //     return (video.snippet.title.includes(name))
  //   })
  //   setVideo
  // }
  const [searchKey, onSearchKey] = useState("");
  const filterdvideos = applyFilter(videos, searchKey);
  return (
    <>
      {videos && (
        <VideosHeader
          sort_options={sort_options}
          getSortedVideo={setVideos}
          // videos={videos}
          option={option}
          setOption={setOption}
          searchKey={searchKey}
          onSearchKey={onSearchKey}
        />
      )}
      <Grid container spacing={5}>
        {filterdvideos.map((item) => {
          return (
            <Grid item xs={12} sm={6} md={6} key={item.id}>
              <Video video={item} />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
}

function getPlaylistTitle(sort_options_) {
  return sort_options_.map((item) => {
    return {
      label: item.snippet.title,
      value: item.snippet.title,
      id: item.id,
    };
  });
}
