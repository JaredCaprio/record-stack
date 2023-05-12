import AlbumCSS from "./Album.module.css";

interface Props {
  image: string;
  title: string;
  artist: string;
  year: string;
  placement: number;
}

const Album: React.FC<Props> = ({ image, title, artist, year, placement }) => {
  return (
    <div className={AlbumCSS.main}>
      <div className={AlbumCSS.image}>
        <div className={AlbumCSS.placement}>{placement}</div>
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

export default Album;
