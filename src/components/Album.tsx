import AlbumCSS from "./Album.module.css";
import { IconButton } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import DragHandleIcon from "@mui/icons-material/DragHandle";

interface Props {
  image: string;
  title: string;
  artist: string;
  year: string;
  placement?: number;
  url: string;
  id: string;
  width?: string;
  delBtn: boolean;
  onDelete: (albumId: string) => void;
}

const Album: React.FC<Props> = ({
  image,
  title,
  artist,
  year,
  placement,
  url,
  id,
  width,
  delBtn,
  onDelete,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width,
  };

  const handleDeleteClick = () => {
    onDelete(id);
  };

  return (
    <div ref={setNodeRef} style={style} className={AlbumCSS.main} data-id={id}>
      <div className={AlbumCSS.image}>
        <IconButton {...attributes} {...listeners}>
          <DragHandleIcon fontSize="large" />
        </IconButton>
        <div className={AlbumCSS.placement}>{placement}</div>
        <a target="_blank" href={url} title="Click to listen on Spotify">
          <img src={image} alt="" height="75" />
        </a>
      </div>
      <div className={AlbumCSS.albumInfo}>
        {delBtn && (
          <IconButton
            onClick={handleDeleteClick}
            sx={{ padding: 0, minWidth: 0 }}
          >
            <ClearRoundedIcon fontSize="small" />
          </IconButton>
        )}
        <span className={AlbumCSS.albumTitle}>{title}</span>
        <span className="artist">{artist}</span>
        <span className={AlbumCSS.year}>{year}</span>
      </div>
    </div>
  );
};

export default Album;
