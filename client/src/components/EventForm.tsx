import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FilledInput,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Paper,
  FormControlLabel,
  Checkbox,
  FormLabel,
  FormGroup,
} from "@material-ui/core";
import { Add, Delete } from "@material-ui/icons";
import { TimesForDay } from "./timesForDay";
import { EventFormProps } from "../pages/editevent";
import { Day, DayNames, Event, Slot } from "@fhswf/bookme-common";

type EditSlotProps = {
  day: Day;
  slots: Slot[];
  onChange: (slots: Slot[]) => void;
};

const EditSlot = (props: EditSlotProps) => {
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    setSlots(
      props.slots.filter((slot) => slot.start.length > 0 && slot.end.length > 0)
    );
  }, [props.slots]);

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      // ensure at least one entry
      if (slots.length == 0) {
        setSlots([{ start: "09:00", end: "17:00" }]);
      }
    } else {
      // ensure no entry
      if (slots.length > 0) {
        setSlots([]);
      }
    }
  };

  const addSlot = () => {
    console.log("add slot");
    let _slots = slots.slice();
    _slots.push({ start: "", end: "" });
    setSlots(_slots);
  };

  const deleteSlot = (index) => () => {
    console.log("delete slot %d", index);
    setSlots(slots.filter((slot, idx) => index !== idx));
  };

  const changeTime =
    (key: keyof Slot, index: number) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("ChangeTime: %s %d %o", key, index, event.target.value);
      let _slots = slots.slice();
      _slots[index][key] = event.target.value;
      setSlots(_slots);
    };

  return (
    <>
      <Grid item>
        <Divider variant="middle" />
      </Grid>

      <Grid item container xs={12}>
        <Grid item xs={2}>
          <FormControl>
            <FormControlLabel
              control={
                <Checkbox checked={slots.length > 0} onChange={handleCheck} />
              }
              label={DayNames[props.day]}
            />
          </FormControl>
        </Grid>
        <Grid item xs={8}>
          <Grid container>
            {slots.map((slot, index) => (
              <>
                <Grid item xs={12}>
                  <FormGroup row spacing="normal">
                    <TextField
                      type="time"
                      margin="normal"
                      placeholder="Starttime"
                      onChange={changeTime("start", index)}
                      value={slot.start}
                    />
                    <span>&nbsp;–&nbsp;</span>
                    <TextField
                      type="time"
                      margin="normal"
                      placeholder="Endtime"
                      onChange={changeTime("end", index)}
                      value={slot.end}
                    />
                    <Button onClick={deleteSlot(index)}>
                      <Delete />
                    </Button>
                  </FormGroup>
                </Grid>
              </>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Button onClick={addSlot}>
            <Add />
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export const EventForm = (props: EventFormProps): JSX.Element => {
  const [formData, setFormData] = useState<Event>(props.event);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    setFormData(props.event);
  }, [props.event]);

  const handleOnSubmit = (event: any) => {
    event.preventDefault();

    props.handleOnSubmit(formData);
  };

  const handleOnChange = (key: keyof Event) => (event: any) => {
    setChanged(true);
    setFormData({ ...formData, [key]: event.target.value } as Event);
  };

  const onChangeSlot = (day: Day) => (slots: Slot[]) => {
    console.log("onChangeSlot: %d %o", day, slots);
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <Paper>
        <Box p="2em">
          <h3>Basic Information</h3>
          <div>
            <TextField
              id="event-title"
              type="text"
              label="Event title"
              required
              fullWidth
              margin="normal"
              variant="filled"
              onChange={handleOnChange("name")}
              value={formData.name}
            />
          </div>

          <div>
            <TextField
              label="Description"
              helperText="What is the purpose of this appointment type?"
              multiline
              fullWidth
              margin="normal"
              variant="filled"
              onChange={handleOnChange("description")}
              value={formData.description}
            />
          </div>

          <div>
            <TextField
              label="Location"
              placeholder="Zoom Meeting"
              helperText="Where does the meeting take place?"
              defaultValue="Online via Zoom"
              margin="normal"
              variant="filled"
              onChange={handleOnChange("location")}
              value={formData.location}
            />
          </div>

          <div>
            <TextField
              label="Event Slug"
              margin="normal"
              variant="filled"
              placeholder="awesome-meeting"
              helperText="Customizable part of the URL"
              onChange={handleOnChange("eventurl")}
              value={formData.eventurl}
            />
          </div>
        </Box>

        <Divider variant="middle" />

        <Box pt="1em" m="2em">
          <h3>Duration</h3>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl margin="normal" variant="filled">
                <InputLabel id="duration-label">Duration</InputLabel>
                <Select
                  labelId="duration-label"
                  id="duration"
                  value={formData.duration}
                  onChange={handleOnChange("duration")}
                >
                  <MenuItem value={15}>15 min</MenuItem>
                  <MenuItem value={30}>30 min</MenuItem>
                  <MenuItem value={45}>45 min</MenuItem>
                  <MenuItem value={60}>60 min</MenuItem>
                </Select>
                <FormHelperText>How long is this event?</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item container xs={12} md={8}>
              <Grid item xs={12} sm={6}>
                <FormControl component="span" margin="normal" variant="filled">
                  <InputLabel id="buffer-before-label">
                    Buffer before
                  </InputLabel>
                  <Select
                    labelId="buffer-before-label"
                    id="buffer-before"
                    value={formData.bufferbefore}
                    onChange={handleOnChange("bufferbefore")}
                  >
                    <MenuItem value={0}>none</MenuItem>
                    <MenuItem value={5}>5 min</MenuItem>
                    <MenuItem value={15}>15 min</MenuItem>
                    <MenuItem value={30}>30 min</MenuItem>
                    <MenuItem value={60}>60 min</MenuItem>
                  </Select>
                  <FormHelperText>Buffer berfore this event</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl component="span" margin="normal" variant="filled">
                  <InputLabel id="buffer-after-label">Buffer after</InputLabel>
                  <Select
                    labelId="buffer-after-label"
                    id="buffer-after"
                    value={formData.bufferafter}
                    onChange={handleOnChange("bufferafter")}
                  >
                    <MenuItem value={0}>none</MenuItem>
                    <MenuItem value={5}>5 min</MenuItem>
                    <MenuItem value={15}>15 min</MenuItem>
                    <MenuItem value={30}>30 min</MenuItem>
                    <MenuItem value={60}>60 min</MenuItem>
                  </Select>
                  <FormHelperText>Buffer after this event</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Divider variant="middle" />

          <h3>Availability</h3>
          <Grid container spacing={3} alignItems="flex-start">
            <Grid item xs={12} sm={6}>
              <TextField
                id="rangedays"
                label="Days in advance"
                value={formData.rangedays}
                type="number"
                variant="filled"
                onChange={handleOnChange("rangedays")}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">Days</InputAdornment>
                  ),
                }}
                aria-describedby="rangedays-helper-text"
                inputProps={{
                  "aria-label": "days",
                }}
                helperText="How many days in advance is this event available?"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl variant="filled">
                <InputLabel id="weekend-label">Available on</InputLabel>
                <Select
                  labelId="weekend-label"
                  id="weekend"
                  value={formData.calendardays}
                  onChange={handleOnChange("calendardays")}
                >
                  <MenuItem value={false}>Working Days</MenuItem>
                  <MenuItem value={true}>All Days</MenuItem>
                </Select>
                <FormHelperText>
                  Is this event avalable on weekends?
                </FormHelperText>
              </FormControl>
            </Grid>
            {console.log("formData: %o", formData)}
            {[0, 1, 2, 3, 4, 5, 6].map((day) => (
              <EditSlot
                day={day}
                slots={formData.available[day as Day]}
                onChange={onChangeSlot(day)}
              />
            ))}
          </Grid>
        </Box>
      </Paper>
      <Button
        variant="contained"
        type="submit"
        className="save"
        disabled={!changed}
      >
        Save
      </Button>
    </form>
  );
};
