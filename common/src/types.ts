import { fromZonedTime } from "date-fns-tz"

/** Enum type representing a day of week.
 *  The ordering is compatible with the native `Date.prototype.getDay()`, which uses 0 for Sunday.
 */
export enum Day {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY
}

export const DayNames = {
  [Day.MONDAY]: "Mon",
  [Day.TUESDAY]: "Tue",
  [Day.WEDNESDAY]: "Wed",
  [Day.THURSDAY]: "Thu",
  [Day.FRIDAY]: "Fri",
  [Day.SATURDAY]: "Sat",
  [Day.SUNDAY]: "Sun",
};

export type Slot = {
  start: string;
  end: string;
};

export type Slots = Record<Day, Slot[]>;

/** Event describes a type of appointment */
export type Event = {
  user: string;
  name: string;
  location: string;
  description: string;
  duration: number;
  isActive: boolean;
  url: string;

  bufferafter: number;
  bufferbefore: number;
  available: Slots;

  /** Minimum time in advance */
  minFuture: number;

  /** Maximum time in advance */
  maxFuture: number;

  /** Maximum number of events per day */
  maxPerDay: number;
};

export const EMPTY_EVENT: Event = {
  user: "",
  name: "",
  location: "",
  description: "",
  duration: 0,
  isActive: false,
  url: "",
  bufferafter: 0,
  bufferbefore: 0,
  available: {
    [Day.MONDAY]: [],
    [Day.TUESDAY]: [],
    [Day.WEDNESDAY]: [],
    [Day.THURSDAY]: [],
    [Day.FRIDAY]: [],
    [Day.SATURDAY]: [],
    [Day.SUNDAY]: [],
  },
  minFuture: 2 * 86400,
  maxFuture: 60 * 86400,
  maxPerDay: 2
};

export interface GoogleTokens extends Document {
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  expiry_date?: number;
}

export interface User {
  email: string;
  name: string;
  user_url: string;
  picture_url: string;
  google_tokens: GoogleTokens;
  push_calendar: string;
  pull_calendars: string[];
};

export class TimeRange {
  start: Date;
  end: Date;

  constructor(start: Date, end: Date);
  constructor(start: string, end: string);

  constructor(start: any, end: any) {
    if (typeof start == 'string') start = new Date(start);
    if (typeof end == 'string') end = new Date(end);
    if (start > end) {
      throw new RangeError('Illegal time interval, start > end');
    }
    this.start = start;
    this.end = end;
  }
}


/**
 * This class represents a set of non-overlapping time intervals.
 * It can be used to represent the free/busy slots in an agenda and supports basic 
 * operations like adding, subtracting, and intersecting interval sets. 
 */
export class IntervalSet extends Array<TimeRange> {

  constructor();
  constructor(timeMin: Date, timeMax: Date);
  constructor(timeMin: string, timeMax: string);
  constructor(other: TimeRange[]);
  constructor(other: any[]);
  constructor(timeMin: Date, timeMax: Date, slots: Slots);
  constructor(timeMin: Date, timeMax: Date, slots: Slots, timeZone: string);
  constructor(...args: any[]) {

    super();
    if (args.length === 0) return;

    if (args.length >= 3 && args[0] instanceof Date && args[1] instanceof Date) {
      this.initializeWithSlots(args[0], args[1], args[2], args[3]);
    } else if (args.length === 2) {
      this.initializeWithDates(args[0], args[1]);
    } else if (args.length === 1 && Array.isArray(args[0])) {
      // console.log('IntervalSet.ctor1(): %o', args)
      this.initializeWithArray(args[0]);
    } else if (args.length === 1) {
      // console.log('IntervalSet.ctor2(): %o %s', args, typeof args[0])
      this.push(args[0]);
    } else {
      throw new Error('Illegal arguments');
    }
  }

  private initializeWithSlots(timeMin: Date, timeMax: Date, slots: Slots, timeZone: string = 'Europe/Berlin') {
    let t = timeMin;
    while (t < timeMax) {
      let day = t.getDay();
      let s: Slot[] = slots[day];
      s.forEach((slot) => {
        const start = this.createDateFromSlot(t, slot.start, timeZone);
        const end = this.createDateFromSlot(t, slot.end, timeZone);
        this.push({ start, end });
      });
      t = new Date(t.getTime() + 1000 * 86400);
    }
  }

  private createDateFromSlot(baseDate: Date, time: string, timeZone: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    let date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);
    return fromZonedTime(date, timeZone);
  }

  private initializeWithDates(start: any, end: any) {
    start = this.convertToDate(start);
    end = this.convertToDate(end);
    if (start > end) {
      throw new RangeError('Illegal time interval, start > end');
    }
    if (start < end) {
      this.push({ start, end });
    }
  }

  private initializeWithArray(arr: any[]) {
    arr = arr.map((x) => {
      x.start = this.convertToDate(x.start);
      x.end = this.convertToDate(x.end);
      this.push(x);
      return x;
    });
  }

  private convertToDate(value: any): Date {
    return (typeof value === 'string' || value instanceof String) ? new Date(value.toString()) : value;
  }


  static equals(r1: TimeRange, r2: TimeRange): boolean {
    //console.log('equals: %o, %o, %o', r1, r2, (r1.start.getTime() == r2.start.getTime()) && (r1.end.getTime() == r2.end.getTime()))
    return (r1.start.getTime() == r2.start.getTime()) && (r1.end.getTime() == r2.end.getTime())
  }

  static overlap(r1: TimeRange, r2: TimeRange): boolean {
    return !(r1.end < r2.start || r2.end < r1.start)
  }

  overlapping(other: TimeRange): number[] {
    let l = []
    this.forEach((range, index) => {
      if (IntervalSet.overlap(range, other)) {
        l.push(index)
      }
    })
    return l.filter((x) => x !== null)
  }

  /**
   * Add a `TimeRange` to the `IntervalSet`.
   * @param other `TimeRange` add
   */
  addRange(other: TimeRange) {
    let _overlapping = this.overlapping(other);
    if (_overlapping.length == 0) {
      this.push(other);
      this.sort((r1, r2) => r1.start.getTime() - r2.start.getTime());
    }
    else {
      _overlapping.forEach((index) => {
        let current = this[index];
        // added segment starts earlier: extend to the left and update other
        if (other.start < current.start) {
          current.start = other.start;
          other.start = other.end;
        }
        // added segment ends later: extend to the right and update other
        if (other.end > current.end) {
          current.end = other.end;
          other.start = other.end;
        }
        if (index > 0) {
          let last = this[index - 1]
          // if last segment overlaps with current, join them (and squah one so that it will be filtered)
          if (last.end >= current.start) {
            last.end = current.end
            current.start = current.end
          }

        }
      })

      // filter out empty segments
      // console.log('addRange: before filter: %o', this)
      let filtered = this.filter(x => x.start < x.end)
      // console.log('addRange: after filter: %o', filtered)
      this.splice(0, this.length, ...filtered);
    }
  }

  /**
   * Calculate the union with another `IntervalSet`.
   * @param other `IntervalSet` to add.
   * @returns Union as `Intervalset`
   * @todo Replace with linear time algorithm.
   */
  add(other: IntervalSet) {

    other.forEach((interval) => {
      this.addRange(interval);
    })

    return this
  }

  /**
   * Calculate the intersection with another `IntervalSet`
   * @param other `IntervalSet`
   * @returns `IntervalSet`
   */
  intersect(other: IntervalSet): IntervalSet {
    let result = new IntervalSet();
    let i = 0;
    let j = 0;

    while (i < this.length && j < other.length) {
      let x = this[i];
      let y = other[j];

      let start = x.start > y.start ? x.start : y.start;
      let end = x.end < y.end ? x.end : y.end;

      if (start < end) {
        result.push({ start, end });
      }

      if (x.end < y.end) {
        i++;
      } else {
        j++;
      }
    }

    return result;
  }

  /**
   * Calculate the inverse of an `IntervalSet`
   * @returns `IntervalSet`
   */
  inverse(): IntervalSet {
    let result = new IntervalSet()

    for (let i = 1; i < this.length; i++) {
      result.push({ start: this[i - 1].end, end: this[i].start })
    }

    return result;
  }
}

