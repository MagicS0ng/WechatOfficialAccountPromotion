document.addEventListener('DOMContentLoaded', () => {
  fetch('/api/admin/checkauth', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => {
    if (!data.authenticated) {
      window.location.href = '/admin/login';
    }else
    {
      document.getElementById('admin-name').textContent =  data.username;
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error loading data. Please try again later.', error);
    window.location.href = '/admin/login';
  });
});

let currentPage = 1;
const itemsPerPage = 10;
let withdrawalsData = [];
let currentSort = { column: null, order: null };

const StatusEnum = Object.freeze({
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
});

const loadWithdrawalsData = async () => {
  try {
    const response = await fetch('/api/admin/fetchrecords', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    withdrawalsData = responseData.records;
    renderPage();
  } catch (error) {
    console.error(`Error loading withdrawals data: ${error}`);
    alert('Failed to load data. Please try again later.');
  }
};

const renderPage = () => {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentData = withdrawalsData.slice(start, end);
  const withdrawalsList = document.getElementById('withdrawalsList');
  withdrawalsList.innerHTML = `
    <div class="withdrawal-item header">
      <span>提现记录id</span>
      <span>微信昵称</span>
      <span>手机号</span>
      <span>可提现金额</span>
      <span onclick="sortBy('status')">status</span>
      <span onclick="sortBy('time')">time</span>
      <span>备注</span>
      <span>提交</span>
    </div>
  `;

  currentData.forEach(item => {
    const withdrawalItem = document.createElement('div');
    withdrawalItem.className = 'withdrawal-item';
    withdrawalItem.innerHTML = `
      <span>${item.id}</span>
      <span>${item.User.nickname}</span>
      <span>${item.User.phone}</span>
      <span>${item.amount}</span>
      <span>${item.status}</span>
      <span>${item.request_date}</span>
      <input type="text" value="${item.remarks}" placeholder="Remarks" data-id="${item.id}" ${item.status !== StatusEnum.PENDING ? 'disabled' : ''}>
      <select data-id="${item.id}" ${item.status !== StatusEnum.PENDING ? 'disabled' : ''}>
        <option value="${StatusEnum.APPROVED}" ${item.status === StatusEnum.APPROVED ? 'selected' : ''}>Approved</option>
        <option value="${StatusEnum.REJECTED}" ${item.status === StatusEnum.REJECTED ? 'selected' : ''}>Rejected</option>
      </select>
      <button class="sync" onclick="syncWithdrawal(${item.id})" ${item.status !== StatusEnum.PENDING ? 'disabled' : ''}>提交审核结果</button>
    `;
    withdrawalsList.appendChild(withdrawalItem);
  });

  document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${Math.ceil(withdrawalsData.length / itemsPerPage)}`;
  document.getElementById('prevPage').disabled = currentPage === 1;
  document.getElementById('nextPage').disabled = end >= withdrawalsData.length;

  const jumpToPageInput = document.getElementById('jumpToPage');
  if (withdrawalsData.length > itemsPerPage) {
    jumpToPageInput.style.display = 'inline';
  } else {
    jumpToPageInput.style.display = 'none';
  }
};

const changePage = (direction) => {
  currentPage += direction;
  renderPage();
};

const jumpToPage = () => {
  const jumpToPageInput = document.getElementById('jumpToPage');
  const pageNumber = parseInt(jumpToPageInput.value);

  if (pageNumber > 0 && pageNumber <= Math.ceil(withdrawalsData.length / itemsPerPage)) {
    currentPage = pageNumber;
    renderPage();
  } else {
    alert('Invalid page number');
  }
};

const syncWithdrawal = (id) => {
  const remarksInput = document.querySelector(`input[data-id='${id}']`);
  const statusSelect = document.querySelector(`select[data-id='${id}']`);

  const updatedRemarks = remarksInput.value;
  const updatedStatus = statusSelect.value;
  const reviewDate = new Date().toISOString();
  const reviewer = document.getElementById('admin-name').textContent;
  fetch(`/api/admin/submitReview?id=${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: updatedStatus,
      remarks: updatedRemarks,
      reviewDate: reviewDate,
      reviewer: reviewer
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert(`Withdrawal ID: ${id} has been updated.`);
      loadWithdrawalsData(); // 重新加载数据以更新界面
    } else {
      alert(`Failed to update Withdrawal ID: ${id}.`);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Error updating withdrawal.');
  });
};

const sortBy = (column) => {
  if (currentSort.column === column) {
    currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
  } else {
    currentSort.column = column;
    currentSort.order = 'asc';
  }

  withdrawalsData.sort((a, b) => {
    if (column === 'status') {
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      return 0;
    } else if (column === 'time') {
      return currentSort.order === 'asc' ? new Date(a.time) - new Date(b.time) : new Date(b.time) - new Date(a.time);
    }
  });

  renderPage();
};

document.addEventListener('DOMContentLoaded', loadWithdrawalsData);