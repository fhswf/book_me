import { Day, IntervalSet, Slots, TimeRange } from "../types"
import { expect, jest, test } from '@jest/globals';

describe('Slots', () => {
    let date1 = new Date("2021-05-17")
    let date2 = new Date("2021-05-20")
    let date3 = new Date("2021-06-01")
    let slots: Slots = {
        [Day.SUNDAY]: [],
        [Day.MONDAY]: [{ start: '10:00', end: '12:00' }, { start: '14:00', end: '17:00' }],
        [Day.TUESDAY]: [],
        [Day.WEDNESDAY]: [],
        [Day.THURSDAY]: [],
        [Day.FRIDAY]: [],
        [Day.SATURDAY]: [],
    }

    test('constructor should create slots with length 2', () => {
        let result = new IntervalSet(date1, date2, slots);
        expect(result.length).toEqual(2);
        expect(result[0].start instanceof Date).toBe(true);
    });
    test('constructor should create slots with length 2', () => {
        let result = new IntervalSet(date1, date3, slots);
        expect(result.length).toEqual(6);
        expect(result[0].start instanceof Date).toBe(true);
    });
    test('constructor should handle timezones', () => {
        let result = new IntervalSet(new Date("2021-05-19T00:00:00.000Z"), new Date("2021-05-26T16:00:00.000Z"), slots, "Europe/Berlin");
        expect(result.length).toEqual(2);
        //console.log('result: %o, %o', result, result[0].start)
        expect(result[0].start.getTime()).toEqual(new Date("2021-05-24T08:00:00.000Z").getTime());
    });
    test('constructor should handle timezones', () => {
        let result = new IntervalSet(new Date("2021-05-19T00:00:00.000Z"), new Date("2021-05-26T16:00:00.000Z"), slots, "Africa/Abidjan");
        expect(result.length).toEqual(2);
        //console.log('result: %o, %o', result, result[0].start)
        expect(result[0].start.getTime()).toEqual(new Date("2021-05-24T10:00:00.000Z").getTime());
    });

})

describe('TimeRange', () => {
    let date1 = new Date("2021-05-17")
    let date2 = new Date("2021-05-20")
    let tr1 = new TimeRange(date1, date2)

    test('constructor with strings', () => {
        let tr2 = new TimeRange("2021-05-17", "2021-05-20")
        expect(IntervalSet.equals(tr1, tr2)).toBe(true)
    })

    test('check for TimeRange', () => {
        expect(() => {
            let tr = new TimeRange(date2, date1)
        }).toThrow()
    })
})
