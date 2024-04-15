import { useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import IconButton from "../components/UI/IconButton";
import { GlobalStyles } from "../constants/styles";
import { useAppDispatch, useAppSelector } from "../utils/hooks";
import { addExpense, deleteExpense, updateExpense } from "../store/expenses";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import {
  deleteExpenseOnDB,
  storeExpense,
  updateExpenseOnDB,
} from "../utils/http";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";

type ManageExpenseProps = {
  navigation: any;
  route: {
    params?: {
      expenseId: string;
    };
  };
};

type ConfirmHandlerProps = {
  amount: number;
  date: Date;
  description: string;
};

export default function ManageExpense({
  route,
  navigation,
}: ManageExpenseProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const expenses = useAppSelector((state) => state.expenses.expenses);
  const dispatch = useAppDispatch();
  const editedExpenseId = route?.params?.expenseId;
  const isEditing = !!editedExpenseId;

  const selectedExpense = expenses.find(
    (expense) => expense.id === editedExpenseId
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  const deleteExpenseHandler = async () => {
    setIsLoading(true);
    try {
      if (!editedExpenseId) throw new Error("No expense id found");
      
      await deleteExpenseOnDB(editedExpenseId);
      dispatch(deleteExpense({ editedExpenseId }));
      navigation.goBack();
    } catch (error) {
      setError("Could not delete expense - please try again later!");
    }
    setIsLoading(false);
  };

  const cancelHandler = () => {
    navigation.goBack();
  };

  const confirmHandler = async (expenseData: ConfirmHandlerProps) => {
    setIsLoading(true);
    try {
      if (isEditing) {
        dispatch(
          updateExpense({
            id: editedExpenseId,
            description: expenseData.description,
            amount: expenseData.amount,
            date: expenseData.date,
          })
        );
        await updateExpenseOnDB(editedExpenseId, expenseData);
      } else {
        const id = await storeExpense(expenseData);
        dispatch(addExpense({ ...expenseData, id }));
      }
      setIsLoading(false);
      navigation.goBack();
    } catch (error) {
      setError("Could not save data please try again later!");
      setIsLoading(false);
    }
  };

  const errorHandler = () => {
    setError("");
  };

  if (error && !isLoading) {
    return <ErrorOverlay message={error} onConfirm={errorHandler} />;
  }

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <ExpenseForm
        submitButtonLabel={isEditing ? "Update" : "Add"}
        onCancel={cancelHandler}
        onSubmit={confirmHandler}
        defaultValues={selectedExpense}
      />

      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteExpenseHandler}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },

  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
