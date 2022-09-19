import React, { useMemo, useState } from "react";
import Debouncer from "../../utils/Debouncer";
import { DEBOUNCER_DELAY_TIME, MOBILE_WIDTH } from "../../consts/consts";
import { DateTypes, OrderTypes, SelectedOptionsType } from "../../hooks/useSortTodo";
import DatePicker from "../DatePicker";
import { useTodoContext } from "../../contexts/TodoContext";
import { compareAsc } from "date-fns";
import { Calendar, FilterByChecked, OrderSelection, TextSearch } from "./SortOptionComponents";
import styled from "styled-components";

type SortOptionsPropsType = {
  selectedOptions: SelectedOptionsType;
  setSelectedOptions: (selectedOptions: SelectedOptionsType) => void;
};

export default function SortOptionBar({
  selectedOptions,
  setSelectedOptions,
}: SortOptionsPropsType) {
  const { dateType, orderBy, searchString, checkedState, dateRange } = selectedOptions;
  const [isShowingDatePicker, setIsShowingDatePicker] = useState(false);
  const { todos } = useTodoContext();
  const beginningDate = useMemo(
    () =>
      todos && todos.length > 0
        ? todos
            .map((todo) => new Date(todo.createdAt))
            .reduce((prev, curr) => (compareAsc(curr, prev) > 0 ? prev : curr))
        : new Date(),
    [todos]
  );

  const setOrderOption = (dateType: DateTypes, order: OrderTypes) => {
    setSelectedOptions({ ...selectedOptions, dateType: dateType, orderBy: order });
  };

  const setTextSearchOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOptions({ ...selectedOptions, searchString: event.target.value });
  };

  const searchTextWithDebouncer = new Debouncer(
    setTextSearchOnChange,
    DEBOUNCER_DELAY_TIME
  ).build();

  const setFilterByCheckedOption = (selectedCheckedValue: boolean | null) => {
    setSelectedOptions({ ...selectedOptions, checkedState: selectedCheckedValue });
  };

  const setDates = (
    selectedDates: { startDate?: Date | null | undefined; endDate?: Date | null | undefined } | null
  ): void =>
    setSelectedOptions({
      ...selectedOptions,
      dateRange: { ...dateRange, ...selectedDates },
    });

  const onDateReset = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsShowingDatePicker(false);
    setSelectedOptions({
      ...selectedOptions,
      dateRange: { startDate: null, endDate: null },
    });
  };
  return (
    <Container>
      <OrderSelection dateType={dateType} orderBy={orderBy} setOption={setOrderOption} />
      <TextSearchPlaceholder>
        <TextSearch
          textToSearch={searchString}
          setSearchOnChange={searchTextWithDebouncer}
          reset={() => setSelectedOptions({ ...selectedOptions, searchString: "" })}
        />
      </TextSearchPlaceholder>
      <Calendar
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation();
          setIsShowingDatePicker(!isShowingDatePicker);
        }}
        dateRange={dateRange}
        reset={onDateReset}
      >
        {isShowingDatePicker && (
          <DatePicker
            beginningDate={beginningDate}
            indicatedDates={todos?.map((todo) => new Date(todo[dateType])) || null}
            preSelectedDates={dateRange}
            setDates={setDates}
            close={() => setIsShowingDatePicker(false)}
          />
        )}
      </Calendar>
      <FilterByChecked selectedOption={checkedState} setOption={setFilterByCheckedOption} />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  position: relative;
  justify-content: space-between;
  gap: 1rem;
  > * {
    width: 100%;
  }
  option,
  input {
    border: none;
  }
  input {
    outline: none;
  }
  @media (max-width: ${MOBILE_WIDTH}px) {
    display: flex;
    flex-wrap: wrap;
    > * {
      width: calc(50% - 0.5rem);
    }
  }
`;

const TextSearchPlaceholder = styled.div``;
