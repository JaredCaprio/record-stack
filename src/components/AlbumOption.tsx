import AlbumCSS from "./Album.module.css";

interface Props {
  image: string;
  title: string;
  artist: string;
  year: string;
  id: string;
  width?: string;
}

const AlbumOption: React.FC<Props> = ({ image, title, artist, year, id }) => {
  return (
    <div className={AlbumCSS.main} data-id={id}>
      <div className={AlbumCSS.image}>
        <img src={image} alt="" height="75" />
      </div>
      <div className={AlbumCSS.albumInfo}>
        <span className={AlbumCSS.albumTitle}>{title}</span>
        <span className="artist">{artist}</span>
        <span className={AlbumCSS.year}>{year}</span>
      </div>
    </div>
  );
};

export default AlbumOption;
