'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  ArrowOutward,
  Assignment,
  AttachMoney,
  Construction,
  Opacity,
  Pets,
  People,
  TrendingDown,
  TrendingUp,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { AnimalStatus, Task, TaskStatus, type Animal, type Payment, type WalletSummary, type Worker } from '@dairy-farm/types';
import { useAuthStore } from '@/store/authStore';
import { animalsApi } from '@/lib/animals-api';
import { milkRecordsApi, type MilkRecord } from '@/lib/milk-records-api';
import { tasksApi } from '@/lib/tasks-api';
import { workersApi } from '@/lib/workers-api';
import { walletApi } from '@/lib/payments-api';
import { getProgressStats, type ProgressStats } from '@/lib/farm-development-api';

type DashboardData = {
  animals: Animal[];
  milkRecords: MilkRecord[];
  tasks: Task[];
  workers: Worker[];
  walletSummary: WalletSummary | null;
  progressStats: ProgressStats;
};

type ActivityItem = {
  id: string;
  title: string;
  subtitle: string;
  timestamp: number;
  path: string;
};

type QuickAction = {
  label: string;
  description: string;
  path: string;
};

type StatCardProps = {
  title: string;
  value: string;
  supportingText: string;
  icon: React.ReactNode;
  tone: 'success' | 'warning' | 'error' | 'info';
  testId: string;
};

const isSameLocalDay = (dateValue: string | Date, referenceDate: Date) => {
  const date = new Date(dateValue);
  return (
    date.getFullYear() === referenceDate.getFullYear() &&
    date.getMonth() === referenceDate.getMonth() &&
    date.getDate() === referenceDate.getDate()
  );
};

const toCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

const toCompactNumber = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);

const formatRelativeDate = (value: number) => {
  const diffMs = Date.now() - value;
  const diffMinutes = Math.round(diffMs / (1000 * 60));

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
};

const getActivityFromAnimals = (animals: Animal[]): ActivityItem[] =>
  animals.slice(0, 4).map((animal) => ({
    id: `animal-${animal.id}`,
    title: `Animal ${animal.tagNumber} added`,
    subtitle: `${animal.breed} • ${animal.acquisitionType.toLowerCase()}`,
    timestamp: new Date(animal.createdAt).getTime(),
    path: '/animals',
  }));

const getActivityFromPayments = (payments: Payment[]): ActivityItem[] =>
  payments.slice(0, 4).map((payment) => ({
    id: `payment-${payment.id}`,
    title:
      payment.type === 'INCOME'
        ? `Income recorded: ${payment.description}`
        : `Expense recorded: ${payment.description}`,
    subtitle: toCurrency(payment.amount),
    timestamp: new Date(payment.transactionDate ?? payment.date).getTime(),
    path: '/payments',
  }));

const getActivityFromTasks = (tasks: Task[]): ActivityItem[] =>
  tasks.slice(0, 4).map((task) => ({
    id: `task-${task.id}`,
    title: `Task ${task.status === TaskStatus.COMPLETED ? 'completed' : 'updated'}`,
    subtitle: task.title,
    timestamp: new Date(task.updatedAt).getTime(),
    path: '/tasks',
  }));

const getActivityFromMilk = (milkRecords: MilkRecord[]): ActivityItem[] =>
  milkRecords.slice(0, 4).map((record) => ({
    id: `milk-${record.id}`,
    title: `Milk recorded for ${record.animal?.tagNumber ?? 'animal'}`,
    subtitle: `${record.quantity} L • ${record.session.toLowerCase()}`,
    timestamp: new Date(record.createdAt).getTime(),
    path: '/milk-records',
  }));

function StatCard({ title, value, supportingText, icon, tone, testId }: StatCardProps) {
  const iconColor =
    tone === 'success'
      ? 'success.main'
      : tone === 'warning'
        ? 'warning.main'
        : tone === 'error'
          ? 'error.main'
          : 'primary.main';

  return (
    <Card sx={{ height: '100%' }} data-testid={testId}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              display: 'grid',
              placeItems: 'center',
              bgcolor: `${iconColor}20`,
              color: iconColor,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Box minWidth={0}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ lineHeight: 1.1 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {supportingText}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const { user } = useAuthStore();
  const farmId = user?.farmId;
  const canViewFinance = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  const canViewWorkers = user?.role === 'ADMIN' || user?.role === 'MANAGER';

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!farmId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [animals, milkRecords, tasks, workers, walletSummary, progressStats] = await Promise.all([
        animalsApi.getAll(farmId),
        milkRecordsApi.getAll(farmId),
        tasksApi.list(farmId),
        canViewWorkers ? workersApi.list(farmId) : Promise.resolve([]),
        canViewFinance ? walletApi.getWalletSummary(farmId) : Promise.resolve(null),
        getProgressStats(farmId),
      ]);

      setData({
        animals,
        milkRecords,
        tasks,
        workers,
        walletSummary,
        progressStats,
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [canViewFinance, canViewWorkers, farmId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const derived = useMemo(() => {
    if (!data) return null;

    const now = new Date();
    const activeAnimals = data.animals.filter(
      (animal) => ![AnimalStatus.SOLD, AnimalStatus.DECEASED].includes(animal.status),
    ).length;
    const milkToday = data.milkRecords
      .filter((record) => isSameLocalDay(record.date, now))
      .reduce((sum, record) => sum + Number(record.quantity), 0);
    const activeWorkers = data.workers.filter((worker) => worker.status === 'ACTIVE').length;
    const overdueTasks = data.tasks.filter((task) => {
      if ([TaskStatus.COMPLETED, TaskStatus.CANCELLED].includes(task.status)) return false;
      return new Date(task.dueDate).getTime() < now.setHours(0, 0, 0, 0);
    }).length;
    const openTasks = data.tasks.filter((task) =>
      [TaskStatus.PENDING, TaskStatus.IN_PROGRESS].includes(task.status),
    ).length;

    const activity = [
      ...getActivityFromAnimals(
        [...data.animals].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      ),
      ...(data.walletSummary
        ? getActivityFromPayments(data.walletSummary.recentTransactions)
        : []),
      ...getActivityFromTasks(
        [...data.tasks].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
      ),
      ...getActivityFromMilk(
        [...data.milkRecords].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      ),
    ]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 6);

    return {
      activeAnimals,
      milkToday,
      activeWorkers,
      overdueTasks,
      openTasks,
      activity,
    };
  }, [data]);

  const quickActions: QuickAction[] = [
    {
      label: 'Add Animal',
      description: 'Register a new calf or purchased animal',
      path: '/animals',
    },
    {
      label: 'Record Milk',
      description: 'Log today’s milk collection in a few taps',
      path: '/milk-records',
    },
    {
      label: 'Create Task',
      description: 'Assign work before the next shift starts',
      path: '/tasks',
    },
    ...(canViewFinance
      ? [
          {
            label: 'Track Payment',
            description: 'Capture incoming sales or farm expenses',
            path: '/payments',
          },
        ]
      : []),
  ];

  if (!farmId) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">
          Your account is not linked to a farm yet, so the dashboard cannot load operational data.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ minHeight: 320, display: 'grid', placeItems: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !data || !derived) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" action={<Button color="inherit" onClick={loadDashboard}>Retry</Button>}>
          {error || 'Failed to load dashboard'}
        </Alert>
      </Container>
    );
  }

  const monthlyIncome = data.walletSummary?.monthlySummary.income ?? 0;
  const monthlyExpenses = data.walletSummary?.monthlySummary.expenses ?? 0;
  const monthlyNet = data.walletSummary?.monthlySummary.net ?? 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={2}
        mb={4}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom data-testid="dashboard-title">
            Farm Dashboard
          </Typography>
          <Typography color="text.secondary">
            Welcome back, {user?.name}. Here&apos;s today&apos;s farm snapshot.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {canViewFinance && data.walletSummary ? (
            <Chip
              color={monthlyNet >= 0 ? 'success' : 'error'}
              icon={monthlyNet >= 0 ? <TrendingUp /> : <TrendingDown />}
              label={`Monthly net ${toCurrency(monthlyNet)}`}
            />
          ) : null}
          <Chip
            color="primary"
            icon={<Construction />}
            label={`Development ${data.progressStats.overallProgress}%`}
          />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Animals"
            value={toCompactNumber(data.animals.length)}
            supportingText={`${derived.activeAnimals} currently on the farm`}
            icon={<Pets />}
            tone="info"
            testId="dashboard-stat-animals"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today&apos;s Milk"
            value={`${derived.milkToday.toFixed(1)} L`}
            supportingText={`${data.milkRecords.length} total milk records logged`}
            icon={<Opacity />}
            tone="success"
            testId="dashboard-stat-milk"
          />
        </Grid>
        {canViewFinance && data.walletSummary ? (
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Monthly Income"
              value={toCurrency(monthlyIncome)}
              supportingText={`Expenses ${toCurrency(monthlyExpenses)} • Balance ${toCurrency(data.walletSummary.currentBalance)}`}
              icon={<AttachMoney />}
              tone={monthlyNet >= 0 ? 'success' : 'error'}
              testId="dashboard-stat-finance"
            />
          </Grid>
        ) : null}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Workers & Tasks"
            value={`${derived.activeWorkers}/${data.workers.length}`}
            supportingText={`${derived.openTasks} open tasks • ${derived.overdueTasks} overdue`}
            icon={<People />}
            tone={derived.overdueTasks > 0 ? 'warning' : 'info'}
            testId="dashboard-stat-operations"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }} data-testid="dashboard-overview">
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
              mb={3}
            >
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Operational Overview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Live summaries across production, finance, people, and development.
                </Typography>
              </Box>
              <Button variant="outlined" onClick={loadDashboard}>
                Refresh
              </Button>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Development Progress
                    </Typography>
                    <Typography variant="h3" fontWeight={700}>
                      {data.progressStats.overallProgress}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {data.progressStats.currentPhase
                        ? `Current phase: ${data.progressStats.currentPhase}`
                        : 'No active phase yet'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Remaining budget {toCurrency(data.progressStats.budgetSummary.remaining)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Task Health
                    </Typography>
                    <Typography variant="h3" fontWeight={700}>
                      {derived.openTasks}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Open tasks across pending and in-progress work.
                    </Typography>
                    <Typography
                      variant="body2"
                      color={derived.overdueTasks > 0 ? 'warning.main' : 'text.secondary'}
                      sx={{ mt: 0.5 }}
                    >
                      {derived.overdueTasks > 0
                        ? `${derived.overdueTasks} tasks are overdue`
                        : 'No overdue tasks right now'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }} data-testid="dashboard-quick-actions">
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Quick Actions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Jump straight into the workflows you use most.
            </Typography>
            <Stack spacing={1.5}>
              {quickActions.map((action) => (
                <Button
                  key={action.path}
                  variant="outlined"
                  onClick={() => router.push(action.path)}
                  sx={{
                    justifyContent: 'space-between',
                    px: 2,
                    py: 1.5,
                    textAlign: 'left',
                  }}
                >
                  <Box>
                    <Typography fontWeight={600}>{action.label}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {action.description}
                    </Typography>
                  </Box>
                  <ArrowOutward fontSize="small" />
                </Button>
              ))}
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3, height: '100%' }} data-testid="dashboard-recent-activity">
            <Typography variant="h6" fontWeight={700} gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              The freshest updates across animals, production, payments, and task tracking.
            </Typography>

            {derived.activity.length === 0 ? (
              <Alert severity="info">No recent activity yet. As your team starts logging work, it will show up here.</Alert>
            ) : (
              <List disablePadding>
                {derived.activity.map((item) => (
                  <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      onClick={() => router.push(item.path)}
                      sx={{ borderRadius: 2 }}
                    >
                      <ListItemText
                        primary={item.title}
                        secondary={`${item.subtitle} • ${formatRelativeDate(item.timestamp)}`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {canViewFinance && data.walletSummary ? (
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, height: '100%' }} data-testid="dashboard-financial-pulse">
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Financial Pulse
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Monthly cash movement and wallet position for this farm.
              </Typography>
              <Stack spacing={2}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Current Wallet Balance
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {toCurrency(data.walletSummary.currentBalance)}
                    </Typography>
                  </CardContent>
                </Card>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Income
                        </Typography>
                        <Typography variant="h6" color="success.main">
                          {toCurrency(monthlyIncome)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Expenses
                        </Typography>
                        <Typography variant="h6" color="error.main">
                          {toCurrency(monthlyExpenses)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          Net
                        </Typography>
                        <Typography variant="h6" color={monthlyNet >= 0 ? 'success.main' : 'error.main'}>
                          {toCurrency(monthlyNet)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Stack>
            </Paper>
          </Grid>
        ) : null}
      </Grid>
    </Container>
  );
};

export default Dashboard;
