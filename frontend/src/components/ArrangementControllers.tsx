import { filterTodosByCheckedType, filterTodosByType, reorderTodosByType } from "../models/useTodoDB";

type ArrangementControllersPropsType = {
  controllers: {
    reorderTodosBy: reorderTodosByType;
    filterTodosByChecked: filterTodosByCheckedType;
    filterTodosBy: filterTodosByType;
  };
};
export default function ArrangementControllers({ controllers }: ArrangementControllersPropsType) {
  return <></>;
}
