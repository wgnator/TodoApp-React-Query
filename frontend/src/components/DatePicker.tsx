import {
  addDays,
  areIntervalsOverlapping,
  differenceInCalendarDays,
  differenceInCalendarMonths,
  endOfDay,
  endOfMonth,
  formatISO,
  getDate,
  getMonth,
  getYear,
  isSameDay,
  isSameMonth,
  nextSunday,
  previousSunday,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { addMonths, compareAsc } from "date-fns/esm";
import { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import { theme } from "../styles/theme";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";
import useDetectOutsideClick from "../hooks/useDetectOutsideClick";
import { MOBILE_WIDTH } from "../consts/consts";

type DateItemPropsType = {
  selectedAsStart?: boolean;
  selectedAsEnd?: boolean;
  selectedAsBetween?: boolean;
  endDateSelected?: boolean;
  startDateSelected?: boolean;
  isToday?: boolean;
  isIndicated?: boolean;
};

export type SelectedDatesType = {
  startDate: Date | null;
  endDate: Date | null;
};
type OutboundDateType = {
  startDate?: Date | null;
  endDate?: Date | null;
};

const MONTH_HEIGHT = 360;

export default function DatePicker({
  beginningDate,
  indicatedDates,
  preSelectedDates,
  setDates,
  close,
}: {
  beginningDate: Date;
  indicatedDates: Date[] | null;
  preSelectedDates: SelectedDatesType;
  setDates: (selectedDates: OutboundDateType | null) => void;
  close: () => void;
}) {
  const today = useRef<Date>(new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const numOfMonths = useMemo<number>(
    () => differenceInCalendarMonths(today.current, beginningDate) + 1,
    []
  );
  const [scrollTop, setScrollTop] = useState(0);
  const { startDate, endDate } = preSelectedDates;

  const handleDateSelection = (selectedDate: Date) => {
    const shouldStartNew = () => startDate === null || (startDate && endDate);
    const isSecondDateSameOrEarlier = () => startDate && compareAsc(selectedDate, startDate) <= 0;
    const isSecondDateLater = () => startDate && compareAsc(selectedDate, startDate) > 0;
    if (shouldStartNew() || isSecondDateSameOrEarlier())
      setDates({ startDate: startOfDay(selectedDate), endDate: null });
    else if (isSecondDateLater()) {
      setDates({ endDate: endOfDay(selectedDate) });
      close();
    }
  };

  useEffect(() => {
    setScrollTop(Math.max(MONTH_HEIGHT * (numOfMonths - 1), 0));
  }, [MONTH_HEIGHT]);

  useEffect(() => {
    if (windowRef.current) windowRef.current.scrollTop = scrollTop;
  }, [scrollTop]);

  useEffect(() => {
    const rerenderOnScroll = () => setScrollTop(windowRef?.current?.scrollTop || 0);
    windowRef?.current?.addEventListener("scroll", rerenderOnScroll);
    return () => windowRef?.current?.removeEventListener("scroll", rerenderOnScroll);
  }, []);

  useDetectOutsideClick([containerRef], () => close());

  return (
    <Container ref={containerRef}>
      {scrollTop > 0 && (
        <ArrowUpWrapper>
          <Clickable
            onClick={(event) => {
              event.stopPropagation();
              setScrollTop(
                scrollTop -
                  (scrollTop % MONTH_HEIGHT === 0 ? MONTH_HEIGHT : scrollTop % MONTH_HEIGHT)
              );
            }}
          />
          <IoIosArrowDropup width="100%" height="100%" />
        </ArrowUpWrapper>
      )}
      {scrollTop < MONTH_HEIGHT * (numOfMonths - 1) && (
        <ArrowDownWrapper>
          <Clickable
            onClick={(event) => {
              event.stopPropagation();
              setScrollTop(
                scrollTop +
                  (MONTH_HEIGHT - (scrollTop % MONTH_HEIGHT) === 0
                    ? MONTH_HEIGHT
                    : MONTH_HEIGHT - (scrollTop % MONTH_HEIGHT))
              );
            }}
          />
          <IoIosArrowDropdown width="100%" height="100%" />
        </ArrowDownWrapper>
      )}
      <WindowContainer ref={windowRef}>
        <MonthsContainer>
          {new Array(numOfMonths).fill(0).map((_, index) => {
            const month = addMonths(beginningDate, index);
            const startDateOfCalendar = previousSunday(startOfMonth(month));
            const endDateOfCalendar = nextSunday(endOfMonth(month));
            return (
              <MonthContainer key={index}>
                <MonthText>
                  {getYear(month)}년 {getMonth(month) + 1}월
                </MonthText>
                <DaysContainer>
                  <DayItem>일</DayItem>
                  <DayItem>월</DayItem>
                  <DayItem>화</DayItem>
                  <DayItem>수</DayItem>
                  <DayItem>목</DayItem>
                  <DayItem>금</DayItem>
                  <DayItem>토</DayItem>
                </DaysContainer>
                <DatesContainer>
                  {new Array(differenceInCalendarDays(endDateOfCalendar, startDateOfCalendar))
                    .fill(0)
                    .map((_, index) => {
                      const date = addDays(startDateOfCalendar, index);
                      return isSameMonth(date, month) ? (
                        <DateItem
                          key={formatISO(date)}
                          isToday={isSameDay(today.current, date)}
                          isIndicated={
                            !!indicatedDates?.find((indicatedDate) =>
                              isSameDay(date, indicatedDate)
                            )
                          }
                          selectedAsStart={startDate ? isSameDay(startDate, date) : false}
                          selectedAsEnd={endDate ? isSameDay(endDate, date) : false}
                          selectedAsBetween={
                            startDate && endDate
                              ? areIntervalsOverlapping(
                                  {
                                    start: addDays(startDate, 1),
                                    end: endDate,
                                  },
                                  { start: date, end: addDays(date, 1) }
                                )
                              : false
                          }
                          endDateSelected={!!endDate}
                          startDateSelected={!!startDate}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDateSelection(date);
                          }}
                        >
                          <DateTextWrapper>{getDate(date)}</DateTextWrapper>
                        </DateItem>
                      ) : (
                        <DateItem key={index} />
                      );
                    })}
                </DatesContainer>
              </MonthContainer>
            );
          })}
        </MonthsContainer>
      </WindowContainer>
    </Container>
  );
}
const ArrowDownWrapper = styled.div`
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  width: 1rem;
  height: 1rem;
  margin: 0;
  z-index: 10;
`;
const ArrowUpWrapper = styled.div`
  position: absolute;
  right: 1rem;
  top: 1rem;
  width: 1rem;
  height: 1rem;
  margin: 0;
  z-index: 10;
`;
const Clickable = styled.div`
  width: 100%;
  height: 100%;
  z-index: 1;
  position: absolute;
  top: 0;
  left: 0;
`;
const Container = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: ${theme.backgroundColor};
  z-index: 10;
  width: 360px;

  border: white 2px solid;
  overflow: hidden;
  border-radius: 10px;

  @media (max-width: ${MOBILE_WIDTH}px) {
    flex-direction: column;
    left: -2px;
    width: 80vw;
    padding: 5%;
    overflow: auto;
  }
`;
const WindowContainer = styled.div`
  width: 100%;
  height: 360px;
  overflow: overlay;
`;
const MonthsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
`;
const MonthContainer = styled.div`
  padding: 1rem 2rem;
  height: 360px;
  margin: 0;
  flex-basis: 100%;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  @media (max-width: ${MOBILE_WIDTH}px) {
    padding: 0;
    margin: 1rem auto;
  }
`;
const MonthText = styled.div`
  font-size: 1.2rem;
  text-align: center;
  width: 100%;
  margin-bottom: 1rem;
`;

const DaysContainer = styled.div`
  width: 100%;
  display: flex;
`;
const DayItem = styled.div`
  color: white;
  height: 23px;
  width: calc(100% / 7);
  display: flex;
  justify-content: center;
  align-items: center;
`;
const DatesContainer = styled.div`
  height: 240px;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
`;

const DateItem = styled.div<DateItemPropsType>`
  height: 40px;
  width: calc(100% / 7);
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  color: ${(props) =>
    props.selectedAsStart || props.selectedAsEnd || props.selectedAsBetween
      ? "rgb(255, 255, 255)"
      : props.isToday
      ? theme.primaryColor
      : "rgb(115, 115, 115)"};

  background-color: ${(props) =>
    !props.selectedAsStart &&
    !props.selectedAsEnd &&
    props.selectedAsBetween &&
    theme.primaryColor};

  ${(props) =>
    (props.selectedAsStart &&
      props.endDateSelected &&
      `background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 49%, ${theme.primaryColor} 50%, ${theme.primaryColor} 100%);`) ||
    (props.selectedAsEnd &&
      props.startDateSelected &&
      `background: linear-gradient(90deg, ${theme.primaryColor} 0% ,  ${theme.primaryColor} 49%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%);`)};

  > * {
    background-color: ${(props) =>
      (props.selectedAsStart || props.selectedAsEnd) && theme.primaryColor};
  }

  ${(props) =>
    props.isIndicated &&
    `
    &::before {
      content: '.';
      font-weight: bold;
      font-size: 2rem;
      color: ${theme.primaryColor};
      position: absolute;
      top:30%;
      margin: auto;
    }
  `}
`;
const DateTextWrapper = styled.div`
  cursor: pointer;
  border-radius: 50%;
  width: 40px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover,
  *:hover {
    border: 2px solid ${theme.primaryColor};
    border-radius: 50%;
  }
`;
