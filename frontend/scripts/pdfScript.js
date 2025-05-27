document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const isPremium = localStorage.getItem('isPremium') === 'true';

  const downloadBtn = document.getElementById('download-pdf-btn');
  if (!isPremium) {
    downloadBtn.disabled = true;
    alert('Only premium users can download the PDF');
  }

  try {
    const res = await axios.get('http://localhost:3000/api/get-all-expenses', {
    headers: { Authorization: `Bearer ${token}` },
    });

    const { daily, monthly, yearly } = res.data;

    renderTable('daily-expenses', daily, 'Daily Expenses');
    renderTable('monthly-expenses', monthly, 'Monthly Expenses');
    renderTable('yearly-expenses', yearly, 'Yearly Expenses');
  } catch (err) {
    alert('Failed to fetch expenses');
    console.error(err);
  }

  downloadBtn.addEventListener('click', () => {
    window.print(); // Basic browser print (can be replaced with jsPDF if needed)
  });
});

function renderTable(containerId, data, title) {
  const container = document.getElementById(containerId);
  const table = document.createElement('table');
  table.innerHTML = `<caption>${title}</caption><tr><th>Type</th><th>Description</th><th>Amount</th><th>Category</th><th>Date</th></tr>`;

  data.forEach(exp => {
    table.innerHTML += `
      <tr>
        <td>${exp.amountType}</td>
        <td>${exp.description}</td>
        <td>${exp.amount}</td>
        <td>${exp.category}</td>
        <td>${new Date(exp.createdAt).toLocaleDateString()}</td>
      </tr>`;
  });

  container.innerHTML = '';
  container.appendChild(table);
}



