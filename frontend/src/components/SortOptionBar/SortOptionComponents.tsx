import React, { ReactNode, useRef, useState } from "react";
import styled from "styled-components";
import SelectBox, { Container as SelectBoxContainer, TriangleDown } from "../SelectBox";
import { BiSearch } from "react-icons/bi";
import { GoCalendar } from "react-icons/go";
import { MdCancel } from "react-icons/md";
import { ImCheckmark2 } from "react-icons/im";

import {
  DateTypes,
  DATE_TYPE,
  FilterByCheckedOptions,
  FILTER_BY_CHECKED_OPTIONS,
  ORDER,
  OrderTypes,
  sortOptionsDictionary,
} from "../../hooks/useSortTodo";


import { theme } from "../../styles/theme";
import { SelectedDatesType } from "../DatePicker";
import { MOBILE_WIDTH } from "../../consts/consts";


const { CHECKED, UNCHECKED, UNFILTERED } = FILTER_BY_CHECKED_OPTIONS;



export const OrderSelection = ({
  dateType,
  orderBy,
  setOption,
}: {
  dateType: DateTypes;
  orderBy: OrderTypes;
  setOption: (dateType: DateTypes, orderBy: OrderTypes) => void;
}) => (
  <OrderSelectionContainer>
    <Option
      name="updatedAt/DSC"
      selected={dateType === DATE_TYPE.UPDATED_AT && orderBy === ORDER.DSC}
      onClick={() => setOption(DATE_TYPE.UPDATED_AT, ORDER.DSC)}
    >
      {sortOptionsDictionary[ORDER.DSC]} {sortOptionsDictionary[DATE_TYPE.UPDATED_AT]}순
    </Option>
    <Option
      name="createdAt/DSC"
      selected={dateType === DATE_TYPE.CREATED_AT && orderBy === ORDER.DSC}
      onClick={() => setOption(DATE_TYPE.CREATED_AT, ORDER.DSC)}
    >
      {sortOptionsDictionary[ORDER.DSC]} {sortOptionsDictionary[DATE_TYPE.CREATED_AT]}순
    </Option>
    <Option
      name="updatedAt/ASC"
      selected={dateType === DATE_TYPE.UPDATED_AT && orderBy === ORDER.ASC}
      onClick={() => setOption(DATE_TYPE.UPDATED_AT, ORDER.ASC)}
    >
      {sortOptionsDictionary[ORDER.ASC]} {sortOptionsDictionary[DATE_TYPE.UPDATED_AT]}순
    </Option>
    <Option
      name="createdAt/ASC"
      selected={dateType === DATE_TYPE.CREATED_AT && orderBy === ORDER.ASC}
      onClick={() => setOption(DATE_TYPE.CREATED_AT, ORDER.ASC)}
    >
      {sortOptionsDictionary[ORDER.ASC]} {sortOptionsDictionary[DATE_TYPE.CREATED_AT]}순
    </Option>
  </OrderSelectionContainer>
);

export const TextSearch = ({
  textToSearch,
  setSearchOnChange,
  reset,
}: {
  textToSearch: string;
  setSearchOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isInputFocus, setIsInputFocus] = useState(false);
  return (
    <TextSearchContainer isFocus={isInputFocus}>
      <label htmlFor="searchString">
        <BiSearch />
      </label>
      <Input
        autoComplete="off"
        onFocus={(event) => {
          event.stopPropagation();
          setIsInputFocus(true);
        }}
        onBlur={(event) => {
          event.stopPropagation();
          setIsInputFocus(false);
        }}
        onChange={setSearchOnChange}
        type="text"
        id="searchString"
        ref={inputRef}
      />
      {(isInputFocus || textToSearch) && (
        <CancelIcon
          onClick={(event) => {
            event.preventDefault();
            if (inputRef.current && inputRef.current.value) {
              inputRef.current.value = "";
              reset();
              setIsInputFocus(false);
            }
          }}
        />
      )}
    </TextSearchContainer>
  );
};

export const Calendar = ({
  dateRange: { startDate, endDate },
  reset,
  onClick,
  children,
}: {
  dateRange: SelectedDatesType;
  reset: (event: React.MouseEvent) => void;
  onClick: (event: React.MouseEvent) => void;
  children: ReactNode;
}) => (
  <CalendarContainer onClick={onClick}>
    <CalendarIcon />
    <DateText>
      {!startDate && "전체"}
      {startDate &&
        startDate.toLocaleDateString("ko-KR", {
          dateStyle: "short",
        })}
      {endDate && (
        <>
          ~
          <br />
          {endDate.toLocaleDateString("ko-KR", {
            dateStyle: "short",
          })}
        </>
      )}
    </DateText>
    {startDate && <CancelIcon onClick={reset} />}
    {!startDate && <TriangleDown />}
    {children}
  </CalendarContainer>
);

export const FilterByChecked = ({
  selectedOption,
  setOption,
}: {
  selectedOption: FilterByCheckedOptions;
  setOption: (selectedOption: FilterByCheckedOptions) => void;
}) => {
  return (
    <FilterByCheckedContainer icon={<ImCheckmark2 />}>
      <Option
        name="null"
        selected={selectedOption === UNFILTERED}
        onClick={() => setOption(UNFILTERED)}
      >
        전체
      </Option>
      <Option
        name="checked"
        selected={selectedOption === CHECKED}
        onClick={() => setOption(CHECKED)}
      >
        완료
      </Option>
      <Option
        name="unchecked"
        selected={selectedOption === UNCHECKED}
        onClick={() => setOption(UNCHECKED)}
      >
        미완료
      </Option>
    </FilterByCheckedContainer>
  );
};


const OrderSelectionContainer = styled(SelectBox)`
  width: 20%;
  option {
    width: 30%;
  }
`;

const TextSearchContainer = styled(SelectBoxContainer)<{ isFocus: boolean }>`
  position: relative;
  border: 2px white solid;
  border-radius: 8px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  label {
    display: block;
    width: 1.3rem;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    * {
      width: 100%;
      height: 100%;
    }
  }

  @media (max-width: ${MOBILE_WIDTH}px) {
    ${(props) =>
      props.isFocus &&
      `      
      position: absolute;
      right: 0;
      height: calc(50% - 0.5rem);
      background-color: ${theme.backgroundColor};
      z-index: 10;
      animation: expand-left-right 0.3s linear;
    `}
  }

  @keyframes expand-left-right {
    0% {
      width: 50%;
    }
    100% {
      width: 100%;
    }
  }
`
const Input = styled.input`
  height: 100%;
  background-color: #242424;
  color: white;
  width: 80%;
  margin-right: 1rem;
  padding: 0.3rem;
  border-radius: 8px;
  font-size: 1rem;
`;
const CancelIcon = styled(MdCancel)`
  position: absolute;
  right: 0.3rem;
  z-index: 10;
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
`;
const CalendarContainer = styled(SelectBoxContainer)`
  width: 30%;
  min-width: 9rem;
  display: flex;
  justify-content: space-between;
  position: relative;

  @media (max-width: ${MOBILE_WIDTH}px) {
    width: calc(50% - 0.5rem);
  }
`;
const CalendarIcon = styled(GoCalendar)`
  width: 1.5rem;
  height: 1.5rem;
`;
const DateText = styled.div`
  text-align: center;
  width: 100%;
  word-wrap: break-word;
  text-overflow: ellipsis;
`;
const FilterByCheckedContainer = styled(SelectBox)`
  width: 20%;
  option {
    width: 30%;
  }
`;
const Option = styled.div<{ name: string; selected: boolean }>`
  width: 100%;
`;
