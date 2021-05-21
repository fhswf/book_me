

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

export type Event = {
  user: string;
  name: string;
  location: string;
  description: string;
  duration: number;
  isActive: boolean;
  url: string;
  rangedays: number;
  calendardays: boolean;
  bufferafter: number;
  bufferbefore: number;
  available: Slots;
};

export const EMPTY_EVENT: Event = {
  user: "",
  name: "",
  location: "",
  description: "",
  duration: 0,
  isActive: false,
  url: "",
  rangedays: 0,
  calendardays: false,
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
  password: string;
  user_url: string;
  picture_url: string;
  google_tokens: GoogleTokens;
  push_calendar: string;
  pull_calendars: string[];
};

type TimeRange = {
  start: Date;
  end: Date;
}

/**
 * This class represents a set of non-overlapping time intervals.
 * It can be used to represent the free/busy slots in an agenda and supports basic 
 * operations like adding, substracting, and intersecting interval sets. 
 */
export class IntervalSet extends Array<TimeRange> {

  constructor(timeMin: Date, timeMax: Date);
  constructor(other: TimeRange[]);
  constructor();
  constructor(...args: any) {
    if (args.length == 0) {
      super()
    }
    else if (args.length == 2 && args[0] instanceof Date && args[1] instanceof Date) {
      super();
      if (args[0] > args[1]) {
        throw new RangeError('Illegal time interval, start > end');
      }
      if (args[0] < args[1]) {
        this.push({ start: args[0], end: args[1] });
      }
    }
    else if (args[0] instanceof Array) {
      super(...(args[0]))
    }
    else if (args.length == 1) {
      super(args[0])
    }
  }

  static equals(r1: TimeRange, r2: TimeRange): boolean {
    console.log('equals: %o, %o, %o', r1, r2, (r1.start.getTime() == r2.start.getTime()) && (r1.end.getTime() == r2.end.getTime()))
    return (r1.start.getTime() == r2.start.getTime()) && (r1.end.getTime() == r2.end.getTime())
  }

  static overlap(r1: TimeRange, r2: TimeRange): boolean {
    return !(r1.end < r2.start || r2.end < r1.start)
  }

  overlapping(other: TimeRange) {
    return this
      .map((range, index) => IntervalSet.overlap(range, other) ? index : null)
      .filter((x) => x != null)
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
      let filtered = this.filter(x => x.start < x.end)
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
   * @returns `Intervalset`
   */
  intersect(other: IntervalSet): IntervalSet {
    let result = new IntervalSet();

    let i = 0;
    let j = 0;
    while (i < this.length && j < other.length) {
      let x = this[i]
      let y = other[j]
      let start: Date = null
      let end: Date = null
      console.log('x: %o, y: %o', x, y)
      // we start first
      if (x.start > y.start) {
        if (x.end > y.start) {
          // intersection
          start = x.start
          end = x.end < y.end ? x.end : y.end
          if (start < end) {
            console.log('add: %o, %o', start, end)
            result.push({ start, end })
          }
        }
        j++
        continue
      }
      else {
        if (y.end > x.start) {
          // intersection
          start = y.start
          end = x.end < y.end ? x.end : y.end
          if (start < end) {
            console.log('add: %o, %o', start, end)
            result.push({ start, end })
          }
        }
        i++
        continue
      }
      console.log('intersect: %o', result)
    }

    console.log('result: %o', result)
    return result
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

