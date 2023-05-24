import { useState, useEffect } from "react";
import Album from "./components/Album";
import AlbumOption from "./components/AlbumOption";
import { Autocomplete, Button, Container, Typography } from "@mui/material";
import TextField from "@mui/material/TextField/TextField";
import HelpDialog from "./components/HelpDialog";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { debounce } from "lodash";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

//type definition
type Album = {
  name: string;
  artists: { name: string }[];
  release_date: string;
  images: { url: string }[];
  id: string;
  external_urls: { spotify: string };
};

function App() {
  //getting album list out of local storage on page load
  const albumListFromLocalStorage = JSON.parse(
    localStorage.getItem("albums") || "[]"
  );

  const [searchInput, setSearchInput] = useState<string>("");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [albumList, setAlbumList] = useState<Album[]>(
    albumListFromLocalStorage
  );
  const [selectedAlbum, setSelectedAlbum] = useState<Album[]>([]);
  const [accessToken, setAccessToken] = useState<string>("");

  //ENV
  const ID = import.meta.env.VITE_SPOT_CLIENT_ID;
  const SECRET = import.meta.env.VITE_SPOT_CLIENT_SECRET;

  //Save albums list into local storage
  useEffect(() => {
    localStorage.setItem("albums", JSON.stringify(albumList));
  }, [albumList]);

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
      .catch((err) => console.error(err));
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
        `https://api.spotify.com/v1/search?q=${searchInput}&type=album&limit=10`,
        albumParams
      );
      const data = await res.json();
      setAlbums(data?.albums?.items);
    } catch (error) {
      console.log(error);
    }
  }, 1000);

  const handleDragEnd = (event: any) => {
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

  //delete item from album list state
  const deleteAlbum = (albumId: string) => {
    setAlbumList((previousState) =>
      previousState.filter((album) => album.id !== albumId)
    );
  };

  //autocomplete options
  const optionsAc =
    albums &&
    albums.map((album) => ({
      name: album.name,
      artists: album.artists[0].name,
      release_date: album.release_date.slice(0, 4),
      images: album?.images[2]?.url,
      external_url: album.external_urls.spotify,
      id: album.id,
    }));

  return (
    <>
      <Container className="main-container">
        <div className="input-container">
          <Autocomplete
            sx={{
              backgroundColor: "#242424",
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#242424",
                },
            }}
            options={optionsAc}
            filterOptions={(options) => options}
            renderOption={(props, optionsAc) => (
              <li {...props} key={optionsAc.id}>
                <AlbumOption
                  title={optionsAc.name}
                  artist={optionsAc.artists}
                  image={optionsAc.images}
                  year={optionsAc.release_date}
                  id={optionsAc.id}
                ></AlbumOption>
              </li>
            )}
            getOptionLabel={(options) => options.name}
            isOptionEqualToValue={() => true}
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{ input: { color: "white" }, label: { color: "white" } }}
                label="Search for Album"
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
                  external_urls: { spotify: value.external_url },
                };

                setSelectedAlbum([album]);
              }
            }}
          />
          <Button
            onClick={() =>
              setAlbumList((previousState) => {
                const albumExists = previousState.some((album) => {
                  return album.id === selectedAlbum[0].id;
                });
                if (albumExists) {
                  return [...previousState];
                }
                return [...previousState, ...selectedAlbum];
              })
            }
            variant="contained"
            color="secondary"
          >
            Add Album
          </Button>
        </div>
        <div className="list-container">
          {albumList.length === 0 && (
            <div style={{ textAlign: "center" }}>
              <Typography variant="h4" sx={{ margin: "1em" }}>
                Welcome to Record Stack
              </Typography>
              <p>Search for an album to start building your List</p>
            </div>
          )}
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={albumList.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {albumList?.map((item, i) => (
                <div key={i}>
                  <Album
                    width={"auto"}
                    delBtn={true}
                    key={item.id}
                    url={item.external_urls.spotify}
                    id={item.id}
                    image={item.images[0].url}
                    title={item.name}
                    artist={item.artists[0].name}
                    year={item.release_date.slice(0, 4)}
                    placement={i + 1}
                    onDelete={deleteAlbum}
                  />
                </div>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </Container>
      <HelpDialog />
    </>
  );
}

export default App;
