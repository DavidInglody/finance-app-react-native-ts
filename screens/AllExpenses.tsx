import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { useAppSelector } from "../utils/hooks";

export default function AllExpenses() {
  const expenses = useAppSelector((state) => state.expenses.expenses);

  return (
    <ExpensesOutput
      expenses={expenses}
      expensesPeriod="Total"
      fallbackText="No registered expenses found"
    />
  );
}
