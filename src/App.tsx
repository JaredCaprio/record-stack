import { useState, useEffect } from "react";
import Album from "./components/Album";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField/TextField";
/* import CircularProgress from "@mui/material"; */
import { debounce } from "lodash";

//interface
type Album = {
  name: string;
  artists: { name: string }[];
  release_date: string;
  images: { url: string }[];
  id: string;
};

function App() {
  const [searchInput, setSearchInput] = useState<string>("Jimmy Hendrix");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [accessToken, setAccessToken] = useState<string>("");
  /*   const [loading, setLoading] = useState<boolean>(false); */

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

    await fetch(
      `https://api.spotify.com/v1/search?q=${searchInput}&type=album&limit=10`,
      albumParams
    )
      .then((res) => res.json())
      .then((data) => {
        setAlbums(data?.albums?.items);
      });
  }, 1500);

  //handle input change
  const handleInputChange = (value: string) => {
    setSearchInput(value);
    if (searchInput.trim().length > 1) {
      search();
    }
    console.log(albums);
  };

  //autocomplete options
  const autoCompleteOptions = albums
    ? albums.map((album) => ({
        label: `${album.name} - ${album.artists[0].name}`,
        key: album.id,
        value: album.id,
      }))
    : [];

  return (
    <>
      <div className="main-container">
        <h1>Top Albums List</h1>
        <div className="input-container">
          <input
            type="text"
            placeholder="Add an Album..."
            onChange={(e) => handleInputChange(e.target.value)}
          />

          <button onClick={() => search()}>Add</button>
        </div>

        <Autocomplete
          sx={{ width: 500, backgroundColor: "white" }}
          options={autoCompleteOptions}
          getOptionLabel={(options) => options.label}
          isOptionEqualToValue={(option, value) => option.key === value.key}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search"
              variant="outlined"
              onChange={(e) => handleInputChange(e.target.value)}
            />
          )}
        />

        {/*     {albums.map((album, i) => (
          <Album
            key={i}
            title={album.name}
            artist={album.artists[0].name}
            year={album.release_date.slice(0, 4)}
            image={album.images[0].url}
            placement={i + 1}
          />
        ))} */}
      </div>
    </>
  );
}

export default App;
