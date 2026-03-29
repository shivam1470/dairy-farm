/* eslint-env jest */

import { ForbiddenException } from '@nestjs/common';
import { TaskStatus, UserRole } from '@prisma/client';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  const assignedTask = {
    id: 'task-1',
    farmId: 'farm-1',
    assignedToId: 'worker-1',
    dueDate: new Date('2026-03-30T00:00:00.000Z'),
    title: 'Clean shed',
    priority: 'MEDIUM',
    status: 'PENDING',
    createdById: 'manager-1',
  };

  it('allows workers to update the status of their own assigned task', async () => {
    const prisma = {
      task: {
        findFirst: jest.fn().mockResolvedValue(assignedTask),
        update: jest.fn().mockResolvedValue({
          ...assignedTask,
          status: TaskStatus.IN_PROGRESS,
        }),
      },
      user: {
        findFirst: jest.fn(),
      },
    };

    const service = new TasksService(prisma as any);
    const result = await service.update(
      { id: 'worker-1', farmId: 'farm-1', role: UserRole.WORKER },
      'task-1',
      { status: TaskStatus.IN_PROGRESS },
    );

    expect(prisma.task.update).toHaveBeenCalled();
    expect(result.status).toBe(TaskStatus.IN_PROGRESS);
  });

  it('rejects workers updating unassigned tasks', async () => {
    const prisma = {
      task: {
        findFirst: jest.fn().mockResolvedValue(assignedTask),
      },
      user: {
        findFirst: jest.fn(),
      },
    };

    const service = new TasksService(prisma as any);

    await expect(
      service.update(
        { id: 'worker-2', farmId: 'farm-1', role: UserRole.WORKER },
        'task-1',
        { status: TaskStatus.IN_PROGRESS },
      ),
    ).rejects.toThrow(ForbiddenException);
  });

  it('rejects workers changing restricted task fields', async () => {
    const prisma = {
      task: {
        findFirst: jest.fn().mockResolvedValue(assignedTask),
      },
      user: {
        findFirst: jest.fn(),
      },
    };

    const service = new TasksService(prisma as any);

    await expect(
      service.update(
        { id: 'worker-1', farmId: 'farm-1', role: UserRole.WORKER },
        'task-1',
        { title: 'New title' },
      ),
    ).rejects.toThrow(ForbiddenException);
  });
});
