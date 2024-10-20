import { ChangeEvent, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { deleteEvent } from "../helpers/services/event_services";
import {
  Alert,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Snackbar,
  Switch,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import { EventDocument } from "../helpers/EventDocument";
import { useTranslation } from "react-i18next";

import "./EventCard.css";


type EventCardProps = {
  event: EventDocument;
  url: string;
  setActive: (event: EventDocument, active: boolean) => void;
  onDelete: (event: EventDocument) => void;
};

export const EventCard = (props: EventCardProps) => {
  const [active, setActive] = useState(props.event.isActive);
  const [success, setSuccess] = useState(false);
  const [failure, setFailure] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const event = props.event;

  const toggleActive = (evt: ChangeEvent<HTMLInputElement>) => {
    setActive(evt.target.checked);
    props.setActive(event, evt.target.checked);
  };

  const handleCopy = () => {
    let loc = window.location;
    let url = `/users/${props.url}/${props.event.url}`;
    url = loc.protocol + "//" + loc.host + url;
    console.log("url: %s", url);

    navigator.clipboard
      .writeText(url)
      .then(() => setSuccess(true))
      .catch((err) => {
        console.log("err: %o", err);
        setFailure(true);
      });
  };

  const handleDelete = () => {
    deleteEvent(props.event._id)
      .then((res) => {
        if (res.data.success === false) {
          navigate("/landing");
        }
      })
      .catch((res) => {
        console.error("deleteEvent failed: %o", res);
        navigate("/landing");
      });
    if (props.onDelete) {
      props.onDelete(props.event);
    }
  };

  return (
    <>


      <Card style={{ maxWidth: "25rem" }}
        data-testid="event-card" className={active ? "active" : "inactive"}>
        <CardHeader
          action={
            <IconButton
              aria-label="settings"
              component={RouterLink}
              data-testid="edit-event-button"
              to={`/editevent/${props.event._id}`}
            >
              <EditIcon />
            </IconButton>
          }
          title={props.event.name}
          subheader={<span>{props.event.duration} min</span>}
        />
        <CardContent>{props.event.description}</CardContent>
        <CardActions>
          <Switch
            data-testid="active-switch"
            checked={active}
            onChange={toggleActive}
            size="small"
            name="active"
            color="primary"
            inputProps={{ "aria-label": "active" }}
          />
          <Button
            data-testid="copy-link-button"
            aria-label={t("large_suave_gull_hush")}
            startIcon={<ShareIcon />}
            onClick={handleCopy}
          >
            {t("misty_proud_mallard_assure")}
          </Button>
          <IconButton
            data-testid="delete-event-button"
            aria-label="delete"
            onClick={handleDelete}
          >
            <DeleteIcon />
          </IconButton>
        </CardActions>
      </Card>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => {
          setSuccess(false);
        }}
      >
        <Alert severity="success">Link copied to clipboard!</Alert>
      </Snackbar>
      <Snackbar open={failure}>
        <Alert severity="error">Could not copy link to clipboard!</Alert>
      </Snackbar>
    </>
  );
};
