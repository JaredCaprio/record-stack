import AlbumCSS from "./Album.module.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  image: string;
  title: string;
  artist: string;
  year: string;
  placement?: number;
  id: string;
}

const Album: React.FC<Props> = ({
  image,
  title,
  artist,
  year,
  placement,
  id,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={AlbumCSS.main}
      data-id={id}
    >
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
