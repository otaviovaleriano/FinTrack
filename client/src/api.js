import axios from 'axios';


const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

export default API;

export const fetchCurrentUser = async (token) => {
  try {
    const { data } = await API.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (err) {
    console.error('Failed to fetch user info:', err);
    return null;
  }
};

export const getExpenses = async (token) => {
  try {
    const { data } = await API.get('/expenses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (err) {
    console.error('Failed to fetch expenses:', err);
    return [];
  }
};

export async function addExpense(expenseData) {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    "http://localhost:5000/api/expenses",
    expenseData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export const deleteExpense = async (id, token) => {
  const res = await API.delete (`/expenses/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateExpense = async (id, updatedTx, token) => {
  const res = await API.put(`/expenses/${id}`, updatedTx, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchSavingsGoal = async (token) => {
  const res = await API.get("/savings-goal", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const saveSavingsGoal = async (goal, token) => {
  const res = await API.post("/savings-goal", goal, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const clearSavingsGoal = async (token) => {
  await API.delete("/savings-goal", {
    headers: { Authorization: `Bearer ${token}` },
  });
};
