import { useState, useEffect } from "react";
import Album from "./components/Album";
import { Autocomplete, Button } from "@mui/material";
import TextField from "@mui/material/TextField/TextField";
import { debounce } from "lodash";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

//interface
type Album = {
  name: string;
  artists: { name: string }[];
  release_date: string;
  images: { url: string }[];
  id: string;
};

function App() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album[]>([]);
  const [accessToken, setAccessToken] = useState<string>("");

  //ENV
  const ID = import.meta.env.VITE_SPOT_CLIENT_ID;
  const SECRET = import.meta.env.VITE_SPOT_CLIENT_SECRET;

  //getting auth token from spotify
  useEffect(() => {
    const authParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=client_credentials&client_id=${ID}&client_secret=${SECRET}`,
    };

    fetch(`https://accounts.spotify.com/api/token`, authParams)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token))
      .catch((err) => console.log(err));
  }, [ID, SECRET]);

  //search

  const search = debounce(async () => {
    const albumParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const res = await fetch(
        `https://api.spotify.com/v1/search?q=${searchInput}&type=album&limit=5`,
        albumParams
      );
      const data = await res.json();
      setAlbums(data?.albums?.items);
    } catch (error) {
      console.log(error);
    }
  }, 1000);

  //handle drag end
  const handleDragEnd = (event: { active: any; over: any }) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setAlbumList((items) => {
        const activeIndex = items.findIndex((item) => item.id == active.id);
        const overIndex = items.findIndex((item) => item.id == over.id);

        return arrayMove(items, activeIndex, overIndex);
      });
    }
  };

  const handleInputChange = (value: string) => {
    setSearchInput(value);
    if (searchInput.trim().length > 0) {
      search();
    }
  };

  //autocomplete options
  const optionsAc =
    albums &&
    albums.map((album) => ({
      name: album.name,
      artists: album.artists[0].name,
      release_date: album.release_date.slice(0, 4),
      images: album.images[0].url,
      id: album.id,
    }));

  return (
    <>
      <div className="main-container">
        <h1>Top Albums List</h1>
        <div className="input-container">
          <Autocomplete
            sx={{ width: 500, backgroundColor: "white", color: "white" }}
            options={optionsAc}
            filterOptions={(options) => options}
            renderOption={(props, optionsAc) => (
              <li {...props} key={optionsAc.id}>
                <Album
                  title={optionsAc.name}
                  artist={optionsAc.artists}
                  image={optionsAc.images}
                  year={optionsAc.release_date}
                  id={optionsAc.id}
                ></Album>
              </li>
            )}
            getOptionLabel={(options) => options.name}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Add an Album"
                variant="outlined"
                onChange={(e) => handleInputChange(e.target.value)}
              />
            )}
            onChange={(_, value) => {
              if (value !== null) {
                const album = {
                  name: value.name,
                  artists: [{ name: value.artists }],
                  release_date: value.release_date,
                  images: [{ url: value.images }],
                  id: value.id,
                };
                setSelectedAlbum([album]);
              }
            }}
          />
          <Button
            onClick={() =>
              setAlbumList((previousState) => {
                const albumExists = previousState.some((album) => {
                  return album.name === selectedAlbum[0].name;
                });
                if (albumExists) {
                  return [...previousState];
                }
                return [...previousState, ...selectedAlbum];
              })
            }
            variant="contained"
            color="primary"
          >
            Add Album
          </Button>
        </div>
        <div className="list-container">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={albumList.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {albumList?.map((item, i) => (
                <Album
                  key={item.name}
                  id={item.id}
                  image={item.images[0].url}
                  title={item.name}
                  artist={item.artists[0].name}
                  year={item.release_date.slice(0, 4)}
                  placement={i + 1}
                />
                /*   <div key={i} id={item.id}>
                  {item.name}
                </div> */
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </>
  );
}

export default App;
