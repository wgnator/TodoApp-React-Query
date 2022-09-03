import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SelectBox, { Container as SelectBoxContainer } from "./SelectBox";
import { BiSearch } from "react-icons/bi";
import { GoCalendar } from "react-icons/go";
import { MdCancel, MdExpandLess, MdExpandMore } from "react-icons/md";
import Debouncer from "../utils/Debouncer";
import { DEBOUNCER_DELAY_TIME, MOBILE_WIDTH } from "../consts/consts";
import { OrderByType, SelectedOptionsType, sortOptionsDictionary } from "../hooks/useSortTodo";
import { SORT_OPTIONS } from "../hooks/useSortTodo";
import DatePicker from "./DatePicker";
import { useTodoContext } from "../contexts/TodoContext";
import { theme } from "../styles/theme";

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
  const [isTextInputOnFocusWhenMobile, setIsTextInputOnFocusWhenMobile] = useState(false);
  const { todos, todosMetaData } = useTodoContext();
  const minimizerRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);
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

  useEffect(() => {
    const detectTextInputState = () =>
      setIsTextInputOnFocusWhenMobile(
        window.innerWidth <= MOBILE_WIDTH && document.activeElement === inputRef.current
      );
    const onWindowResize = () => {
      if (selectedOptions.filterByStringIncluding) detectTextInputState();
    };
    detectTextInputState();
    window.addEventListener("resize", onWindowResize);
    return () => window.removeEventListener("resize", onWindowResize);
  }, []);
  console.log(isShowingDatePicker);
  return (
    <>
      <Minimizer
        ref={minimizerRef}
        onClick={() => minimizerRef?.current?.classList.toggle("show_options")}
      >
        <div>정렬/검색옵션</div>
        <div>
          <MdExpandMore />
        </div>
        <div>
          <MdExpandLess />
        </div>
      </Minimizer>
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
        <FilterInputWrapper>
          <FilterInput>
            <label htmlFor="searchString">
              <BiSearch />
            </label>
            <input
              ref={inputRef}
              onChange={handleInputChangeWithDebouncer}
              type="text"
              id="searchString"
            />
            {selectedOptions.filterByStringIncluding && (
              <CancelIcon
                tabIndex={isTextInputOnFocusWhenMobile ? -1 : 0}
                onClick={(event) => {
                  console.log("clicked!");
                  event.preventDefault();
                  if (inputRef.current && inputRef.current.value) {
                    inputRef.current.value = "";
                    setSelectedOptions({ ...selectedOptions, filterByStringIncluding: "" });
                  }
                }}
              />
            )}
          </FilterInput>
        </FilterInputWrapper>
        <CalendarIconWrapper
          onClick={(event) => {
            event.stopPropagation();
            setIsShowingDatePicker(!isShowingDatePicker);
          }}
        >
          <CalendarIcon />
          <DateText>
            {selectedOptions.filterByDate.startDate &&
              (selectedOptions.filterByDate.endDate
                ? `${selectedOptions.filterByDate.startDate.toLocaleDateString(
                    "ko-KR"
                  )} ~ ${selectedOptions.filterByDate.endDate.toLocaleDateString("ko-KR")}`
                : selectedOptions.filterByDate.startDate.toLocaleDateString("ko-KR"))}
          </DateText>
          {selectedOptions.filterByDate.startDate && (
            <CancelIcon
              onClick={(event) => {
                event.stopPropagation();
                setIsShowingDatePicker(false);
                setSelectedOptions({
                  ...selectedOptions,
                  filterByDate: { startDate: null, endDate: null },
                });
              }}
            />
          )}
        </CalendarIconWrapper>
        <CheckedFilterSelection>
          <Option
            name="null"
            selected={isChecked === null}
            onClick={() => handleOnClickFilterCheckedOption(null)}
          >
            완료/미완료: 전체
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
        {isShowingDatePicker && (
          <DatePicker
            beginningDate={todosMetaData.beginningDate}
            indicatedDates={todos?.map((todo) => new Date(todo[criterion])) || null}
            preSelectedDates={selectedOptions.filterByDate}
            callback={(selectedDates, isClosed) =>
              isClosed
                ? setIsShowingDatePicker(false)
                : setSelectedOptions({
                    ...selectedOptions,
                    filterByDate: { ...selectedOptions.filterByDate, ...selectedDates },
                  })
            }
          />
        )}
      </Container>
    </>
  );
}

const Minimizer = styled.div`
  display: none;
  border-bottom: 1px solid ${theme.primaryColor};
  * {
    color: white;
  }
  @media (max-width: ${MOBILE_WIDTH}px) {
    display: flex;
    justify-content: space-between;
    + div {
      display: none;
    }
    div:nth-child(2) {
      display: block;
      * {
        display: block;
      }
    }
    div:nth-child(3) {
      display: none;
      * {
        display: none;
      }
    }
    &.show_options + div {
      display: flex;
      flex-wrap: wrap;
      > * {
        width: 45%;
      }
      > .date-picker {
        width: 100%;
        position: inherit;
      }
    }
    &.show_options {
      div:nth-child(2) {
        display: none;
        * {
          display: none;
        }
      }
      div:nth-child(3) {
        display: block;
        * {
          display: block;
        }
      }
    }
  }
`;
const Container = styled.div`
  width: 100%;
  position: relative;
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
  @media (max-width: ${MOBILE_WIDTH}px) {
  }
`;
const OrderSelection = styled(SelectBox)`
  width: 20%;
  option {
    width: 30%;
  }
`;
const FilterInputWrapper = styled.div`
  width: 50%;
`;
const FilterInput = styled.div`
  position: relative;
  border: 2px white solid;
  border-radius: 8px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  input {
    height: 100%;
    background-color: #242424;
    color: white;
    width: 80%;
    margin-left: 1rem;
    padding: 0.3rem;
    border-radius: 8px;
    font-size: 1rem;
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
    @media (max-width: 620px) {
      width: 2rem;
    }
  }

  @media (max-width: 620px) {
    input {
      width: 90%;
    }

    &:focus-within {
      position: absolute;
      right: 0;
      height: calc(50% - 0.5rem);
      background-color: ${theme.backgroundColor};
      z-index: 10;
      animation: expand-left-right 0.3s linear;
    }
  }
  @keyframes expand-left-right {
    0% {
      width: 50%;
    }
    100% {
      width: 100%;
    }
  }
`;
const CancelIcon = styled(MdCancel)`
  margin: 0 0.3rem;

  z-index: 10;
`;
const CalendarIconWrapper = styled(SelectBoxContainer)`
  width: 3rem;
  display: flex;
  justify-content: center;
  position: relative;
`;
const CalendarIcon = styled(GoCalendar)`
  width: 1.5rem;
  height: 1.5rem;
`;
const DateText = styled.div`
  text-align: right;
  font-size: 0.8rem;
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
