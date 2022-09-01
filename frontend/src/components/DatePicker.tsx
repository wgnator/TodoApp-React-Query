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
import { Dispatch, SetStateAction, useEffect, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import { theme } from "../styles/theme";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";

import { SelectedOptionsType } from "../hooks/useSortTodo";

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
export default function DatePicker({
  beginningDate,
  indicatedDates,
  selectedOptions,
  setSelectedOptions,
}: {
  beginningDate: Date;
  indicatedDates: Date[] | null;
  selectedOptions: SelectedOptionsType;
  setSelectedOptions: Dispatch<SetStateAction<SelectedOptionsType>>;
}) {
  const today = useRef<Date>(new Date());
  const windowRef = useRef<HTMLDivElement>(null);
  const monthsContainerRef = useRef<HTMLDivElement>(null);
  const monthRef = useRef<HTMLDivElement>(null);
  const numOfMonths = differenceInCalendarMonths(today.current, beginningDate) + 1;
  const [monthHeight, setMonthHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const { startDate, endDate } = selectedOptions.filterByDate;

  const handleDateSelection = (selectedDate: Date) => {
    if (startDate === null || (startDate && endDate))
      setSelectedOptions({
        ...selectedOptions,
        filterByDate: { startDate: startOfDay(selectedDate), endDate: null },
      });
    else if (compareAsc(selectedDate, startDate) > 0)
      setSelectedOptions({
        ...selectedOptions,
        filterByDate: { ...selectedOptions.filterByDate, endDate: endOfDay(selectedDate) },
      });
    else
      setSelectedOptions({
        ...selectedOptions,
        filterByDate: { ...selectedOptions.filterByDate, startDate: selectedDate },
      });
  };

  useLayoutEffect(() => {
    if (monthsContainerRef?.current)
      setMonthHeight(monthsContainerRef?.current.clientHeight / numOfMonths);
  }, []);

  useEffect(() => {
    if (windowRef.current && monthsContainerRef.current && monthRef.current)
      setScrollTop(monthHeight * (numOfMonths - 1));
  }, [monthHeight]);

  useEffect(() => {
    if (windowRef.current) windowRef.current.scrollTop = scrollTop;
  }, [scrollTop]);

  useEffect(() => {
    const rerenderWhenScroll = () => setScrollTop(windowRef?.current?.scrollTop || 0);
    windowRef?.current?.addEventListener("scroll", rerenderWhenScroll);
    return () => windowRef?.current?.removeEventListener("scroll", rerenderWhenScroll);
  }, []);

  return (
    <Container>
      {scrollTop !== 0 && (
        <ArrowUpWrapper>
          <Clickable
            onClick={(event) => {
              setScrollTop(scrollTop - (scrollTop % monthHeight || monthHeight));
              console.log(scrollTop - monthHeight);
            }}
          />
          <IoIosArrowDropup width="100%" height="100%" />
        </ArrowUpWrapper>
      )}
      {scrollTop <= monthHeight * (numOfMonths - 1) && (
        <ArrowDownWrapper>
          <Clickable
            onClick={(event) => {
              setScrollTop(scrollTop + (monthHeight - (scrollTop % monthHeight) || monthHeight));
              console.log(scrollTop + monthHeight);
            }}
          />
          <IoIosArrowDropdown width="100%" height="100%" />
        </ArrowDownWrapper>
      )}
      <WindowContainer ref={windowRef} className="window">
        <MonthsContainer ref={monthsContainerRef}>
          {new Array(numOfMonths).fill(0).map((_, index) => {
            const month = addMonths(beginningDate, index);
            const startDateOfCalendar = previousSunday(startOfMonth(month));
            const endDateOfCalendar = nextSunday(endOfMonth(month));
            return (
              <MonthContainer key={index} ref={monthRef}>
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
                        <DateItem></DateItem>
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
  right: 2rem;
  bottom: 1rem;
  width: 1rem;
  height: 1rem;
  margin: 0;
  z-index: 10;
`;
const ArrowUpWrapper = styled.div`
  position: absolute;
  right: 4rem;
  bottom: 1rem;
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
  width: 400px;

  border: white 3px solid;
  overflow: hidden;
  border-radius: 10px;
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
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
  flex-basis: 100%;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  @media (max-width: 480px) {
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
