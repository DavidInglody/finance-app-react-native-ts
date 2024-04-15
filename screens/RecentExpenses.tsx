import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { getDateMinusDays } from "../utils/date";
import { useEffect, useState } from "react";
import { fetchExpenses } from "../utils/http";
import { setExpenses } from "../store/expenses";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

export default function RecentExpenses() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const expenses = useAppSelector((state) => state.expenses.expenses);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getExpenses = async () => {
      setIsLoading(true);
      try {
        const expenses = await fetchExpenses();
        dispatch(setExpenses({ expenses }));
      } catch (error) {
        setError("Could not fetch expenses!");
      }
      setIsLoading(false);
    };
    getExpenses();
  }, []);

  const errorHandler = () => {
    setError("");
  };

  if (error && !isLoading) {
    return <ErrorOverlay message={error} onConfirm={errorHandler} />;
  }

  if (isLoading) {
    return <LoadingOverlay />;
  }

  const recentExpenses = expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);
    return expense.date > date7DaysAgo;
  });

  return (
    <ExpensesOutput
      expenses={recentExpenses}
      expensesPeriod="Last 7 Days"
      fallbackText="No expenses registered for the last 7 days"
    />
  );
}
