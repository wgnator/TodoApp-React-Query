import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SelectBox, { Container as SelectBoxContainer } from "./SelectBox";
import { BiSearch } from "react-icons/bi";
import { GoCalendar } from "react-icons/go";
import Debouncer from "../utils/Debouncer";
import { DEBOUNCER_DELAY_TIME } from "../consts/consts";
import { OrderByType, SelectedOptionsType, sortOptionsDictionary } from "../hooks/useSortTodo";
import { SORT_OPTIONS } from "../hooks/useSortTodo";
import DatePicker from "./DatePicker";
import { useTodoContext } from "../contexts/TodoContext";

type SortControllersPropsType = {
  selectedOptions: SelectedOptionsType;
  setSelectedOptions: Dispatch<SetStateAction<SelectedOptionsType>>;
};

export default function SortControllerComponents({
  selectedOptions,
  setSelectedOptions,
}: SortControllersPropsType) {
  const { criterion, order } = selectedOptions.orderBy;
  const { filterByIsChecked: isChecked } = selectedOptions;
  const [isShowingDatePicker, setIsShowingDatePicker] = useState(false);
  const { todos, todosMetaData } = useTodoContext();

  const handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOptions({ ...selectedOptions, filterByStringIncluding: event.target.value });
  };

  const handleOnClickOrderOption = (
    criterion: OrderByType["criterion"],
    order: OrderByType["order"]
  ) => {
    setSelectedOptions({ ...selectedOptions, orderBy: { criterion: criterion, order: order } });
  };

  const handleOnClickFilterCheckedOption = (selectedCheckedValue: boolean | null) => {
    setSelectedOptions({ ...selectedOptions, filterByIsChecked: selectedCheckedValue });
  };

  const handleInputChangeWithDebouncer = new Debouncer(
    handleInputOnChange,
    DEBOUNCER_DELAY_TIME
  ).build();

  return (
    <Container>
      <OrderSelection>
        <Option
          name="updatedAt/newestFirst"
          selected={criterion === SORT_OPTIONS.UPDATED_AT && order === SORT_OPTIONS.NEWEST_FIRST}
          onClick={() =>
            handleOnClickOrderOption(SORT_OPTIONS.UPDATED_AT, SORT_OPTIONS.NEWEST_FIRST)
          }
        >
          {sortOptionsDictionary[SORT_OPTIONS.NEWEST_FIRST]}{" "}
          {sortOptionsDictionary[SORT_OPTIONS.UPDATED_AT]}순
        </Option>
        <Option
          name="createdAt/newestFirst"
          selected={criterion === SORT_OPTIONS.CREATED_AT && order === SORT_OPTIONS.NEWEST_FIRST}
          onClick={() =>
            handleOnClickOrderOption(SORT_OPTIONS.CREATED_AT, SORT_OPTIONS.NEWEST_FIRST)
          }
        >
          {sortOptionsDictionary[SORT_OPTIONS.NEWEST_FIRST]}{" "}
          {sortOptionsDictionary[SORT_OPTIONS.CREATED_AT]}순
        </Option>
        <Option
          name="updatedAt/oldestFirst"
          selected={criterion === SORT_OPTIONS.UPDATED_AT && order === SORT_OPTIONS.OLDEST_FIRST}
          onClick={() =>
            handleOnClickOrderOption(SORT_OPTIONS.UPDATED_AT, SORT_OPTIONS.OLDEST_FIRST)
          }
        >
          {sortOptionsDictionary[SORT_OPTIONS.OLDEST_FIRST]}{" "}
          {sortOptionsDictionary[SORT_OPTIONS.UPDATED_AT]}순
        </Option>
        <Option
          name="createdAt/oldestFirst"
          selected={criterion === SORT_OPTIONS.CREATED_AT && order === SORT_OPTIONS.OLDEST_FIRST}
          onClick={() =>
            handleOnClickOrderOption(SORT_OPTIONS.CREATED_AT, SORT_OPTIONS.OLDEST_FIRST)
          }
        >
          {sortOptionsDictionary[SORT_OPTIONS.OLDEST_FIRST]}{" "}
          {sortOptionsDictionary[SORT_OPTIONS.CREATED_AT]}순
        </Option>
      </OrderSelection>
      <FilterInput>
        <label htmlFor="searchString">
          <BiSearch />
        </label>
        <input onChange={handleInputChangeWithDebouncer} type="text" id="searchString" />
      </FilterInput>
      <CalendarIconWrapper>
        <CalendarIcon onClick={() => setIsShowingDatePicker(!isShowingDatePicker)} />
      </CalendarIconWrapper>
      {isShowingDatePicker && (
        <DatePicker
          beginningDate={todosMetaData.beginningDate}
          indicatedDates={todos?.map((todo) => new Date(todo[criterion])) || null}
          preSelectedDates={selectedOptions.filterByDate}
          callback={(selectedDates) =>
            setSelectedOptions({
              ...selectedOptions,
              filterByDate: { ...selectedOptions.filterByDate, ...selectedDates },
            })
          }
        />
      )}

      <CheckedFilterSelection>
        <Option
          name="null"
          selected={isChecked === null}
          onClick={() => handleOnClickFilterCheckedOption(null)}
        >
          전체
        </Option>
        <Option
          name="checked"
          selected={isChecked === true}
          onClick={() => handleOnClickFilterCheckedOption(true)}
        >
          완료된 항목
        </Option>
        <Option
          name="unchecked"
          selected={isChecked === false}
          onClick={() => handleOnClickFilterCheckedOption(false)}
        >
          미완료된 항목
        </Option>
      </CheckedFilterSelection>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  position: relative;
  justify-content: space-between;
  gap: 1rem;
  option,
  input {
    border: none;
  }
  input {
    outline: none;
  }
`;
const OrderSelection = styled(SelectBox)`
  width: 20%;
  option {
    width: 30%;
  }
`;
const FilterInput = styled.div`
  border: 3px white solid;
  border-radius: 8px;
  width: 50%;
  display: flex;
  input {
    background-color: #242424;
    color: white;
    width: 80%;
    margin-left: 1rem;
    padding: 0.3rem;
  }
  label {
    display: block;
    width: 3rem;
    height: 100%;
    border-right: 1px solid white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    * {
      width: 50%;
      height: 50%;
    }
  }
`;
const CalendarIconWrapper = styled(SelectBoxContainer)`
  width: 3rem;
  justify-content: center;
  position: relative;
`;
const CalendarIcon = styled(GoCalendar)`
  width: 100%;
  height: 2rem;
`;
const CheckedFilterSelection = styled(SelectBox)`
  width: 20%;
  option {
    width: 30%;
  }
`;
const Option = styled.div<{ name: string; selected: boolean }>`
  width: 100%;
`;
