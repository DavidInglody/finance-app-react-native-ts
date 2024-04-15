import axios from "axios";

const BACKEND_URL =
  "https://react-native-expenses-7cc00-default-rtdb.europe-west1.firebasedatabase.app";

export async function storeExpense(expenseData: {
  amount: number;
  date: Date;
  description: string;
}) {
  const response = await axios.post(
    BACKEND_URL + "/expenses.json",
    expenseData
  );
  const id = response.data.name;
  return id;
}

export async function fetchExpenses() {
  const response = await axios.get(BACKEND_URL + "/expenses.json");

  const expenses = [];

  for (const key in response.data) {
    const expenseObj = {
      id: key,
      amount: response.data[key].amount,
      date: new Date(response.data[key].date),
      description: response.data[key].description,
    };
    expenses.push(expenseObj);
  }

  return expenses;
}

export function updateExpenseOnDB(
  id: string,
  expenseData: { description: string; amount: number; date: Date }
) {
  return axios.put(BACKEND_URL + `/expenses/${id}.json`, expenseData);
}

export function deleteExpenseOnDB(id: string | undefined) {
  return axios.delete(BACKEND_URL + `/expenses/${id}.json`);
}
