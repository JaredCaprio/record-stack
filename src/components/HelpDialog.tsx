import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { QuestionMark } from "@mui/icons-material";
import { useState } from "react";

const fabStyle = {
  margin: 0,
  top: "auto",
  right: 20,
  bottom: 20,
  left: "auto",
  position: "fixed",
};

export default function HelpDialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Fab
        onClick={() => setOpen(true)}
        sx={fabStyle}
        color="primary"
        aria-label="help"
      >
        <QuestionMark fontSize="large" />
      </Fab>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="Dialog-title"
      >
        <DialogTitle id="dialog-title">How to use Record Stack</DialogTitle>
        <DialogContent>
          <>
            <List>
              <ListItem>
                <ListItemText>
                  Type Name of Album or Artist into the search bar
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  Select one album from the dropdown menu
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  Click the "add album" button to add to list
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  Click and drag on handle to rearrange order
                </ListItemText>
              </ListItem>
            </List>
            <Typography>
              The Spotify API is utilized to fetch data such as album names,
              artists, release dates, and cover images.
            </Typography>
          </>
        </DialogContent>
        <code
          style={{
            position: "absolute",
            bottom: 15,
            left: 25,
            fontSize: 11,
            maxWidth: "10rem",
            textAlign: "center",
          }}
        >
          Designed and Developed by{" "}
          <a href="https://www.github.com/jaredcaprio">Jared Caprio</a>
        </code>
        <DialogActions>
          <Button autoFocus onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
