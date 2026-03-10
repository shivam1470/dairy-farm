import { redirect } from 'next/navigation';

// Expenses feature removed; keep users on Payments.
export default function ExpensesPage() {
  redirect('/payments');
}
