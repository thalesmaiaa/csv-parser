import { randomUUID } from 'node:crypto';

import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description, completed_at, created_at, updated_at } =
        req.body;

      if (title && description) {
        database.insert('tasks', {
          id: randomUUID(),
          title,
          description,
          completed_at,
          created_at,
          updated_at,
        });

        return res.writeHead(201).end();
      }

      return res.writeHead(400, 'Missing required parameteres').end();
    },
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks');

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const deletedTask = database.delete('tasks', id);

      if (deletedTask === null) {
        return res.writeHead(404, 'Task not found').end();
      }

      return res.writeHead(204).end();
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { title, description, completed_at, created_at, updated_at } =
        req.body;
      const { id } = req.params;

      if (title && description) {
        const update = database.update('tasks', {
          id,
          title,
          description,
          completed_at,
          created_at,
          updated_at,
        });

        if (update === null) {
          return res.writeHead(404, 'Task not found').end();
        }

        return res.writeHead(204).end();
      }
      return res.writeHead(400, 'Missing required parameteres').end();
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { completed_at } = req.body;
      const { id } = req.params;
      const complete = database.complete('tasks', {
        id,
        completed_at,
      });

      if (complete === null) {
        return res.writeHead(404, 'Task not found').end();
      }

      return res.writeHead(204).end();
    },
  },
];
