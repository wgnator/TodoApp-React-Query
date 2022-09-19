import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import * as todoService from "../services/todoService";
import { createError, createResponse } from "../utils/responseUtils";
import { TODO_VALIDATION_ERRORS } from "../utils/validator";
import type { TodoInput } from "../types/todos";

export const createTodo = async (
  req: Request<{ id: string }, unknown, TodoInput, { userId: string }>,
  res: Response
) => {
  const { title, content } = req.body;
  const { userId } = req.query;
  if (title) {
    const todo = await todoService.createTodo(userId, { userId, title, content, checked: false });
    return res.status(StatusCodes.OK).send(createResponse(todo));
  } else {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createError(TODO_VALIDATION_ERRORS.INVALID_VALUE));
  }
};

export const getTodos = async (
  req: Request<
    unknown,
    unknown,
    unknown,
    { itemsPerPage: number; page: number; countOnly: boolean; userId: string }
  >,
  res: Response
) => {
  const { itemsPerPage = 10, page = 0, countOnly, userId } = req.query;
  const todos = todoService.findTodos(userId);

  const pageEndIndex = todos ? Math.max(todos.length - Number(itemsPerPage) * Number(page), 0) : 0;
  const pageStartIndex = todos
    ? Math.max(todos.length - Number(itemsPerPage) * Number(page) - Number(itemsPerPage), 0)
    : 0;

  if (todos) {
    if (countOnly) {
      return res.status(StatusCodes.OK).send(createResponse(todos.length));
    }
    return res
      .status(StatusCodes.OK)
      .send(createResponse({ result: todos.slice(pageStartIndex, pageEndIndex), page: page }));
  } else {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createError(TODO_VALIDATION_ERRORS.TODO_SOMETHING_WRONG));
  }
};

export const getTodoById = (
  req: Request<{ id: string }, unknown, unknown, { userId: string }>,
  res: Response
) => {
  const { id: todoId } = req.params;
  const { userId } = req.query;
  const todo = todoService.findTodo(userId, (todo) => todo.id === todoId);

  if (todo) {
    return res.status(StatusCodes.OK).send(createResponse(todo));
  } else {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createError(TODO_VALIDATION_ERRORS.TODO_SOMETHING_WRONG));
  }
};

export const updateTodo = async (
  req: Request<{ id: string }, unknown, TodoInput, { userId: string }>,
  res: Response
) => {
  const todoId = req.params.id;
  const { title, content, checked } = req.body;
  const { userId } = req.query;
  const todo = todoService.findTodo(userId, (todo) => todo.id === todoId);

  if (todo) {
    await todoService.updateTodo(todo, { title, content, checked });

    return res.status(StatusCodes.OK).send(createResponse(todo));
  } else {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createError(TODO_VALIDATION_ERRORS.TODO_SOMETHING_WRONG));
  }
};

export const deleteTodo = async (
  req: Request<{ id: string }, unknown, unknown, { userId: string }>,
  res: Response
) => {
  const { id: todoId } = req.params;
  const { userId } = req.query;
  const todo = todoService.findTodo(userId, (todo) => todo.id === todoId);

  if (!todo) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send(createError(TODO_VALIDATION_ERRORS.TODO_SOMETHING_WRONG));
  }

  await todoService.deleteTodo(userId, todo);

  return res.status(StatusCodes.OK).send(createResponse(null));
};
