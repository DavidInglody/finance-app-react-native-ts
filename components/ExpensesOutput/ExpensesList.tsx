import { FlatList, Text } from "react-native";
import { Expenses } from "../../utils/types";
import ExpenseItem from "./ExpenseItem";

type ExpensesListProps = {
  expenses: Expenses[];
};

type RenderExpenseItemProps = {
  item: Expenses;
};

const renderExpenseItem = ({ item }: RenderExpenseItemProps) => {
  return <ExpenseItem {...item} />;
};

export default function ExpensesList({ expenses }: ExpensesListProps) {
  return (
    <FlatList
      data={expenses}
      renderItem={renderExpenseItem}
      keyExtractor={({ id }) => id}
    />
  );
}
