document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const tableBody = document.querySelector('#contact-table tbody');
  const searchInput = document.getElementById('search');
  const sortSelect = document.getElementById('sort');

  function loadContacts() {
    const search = searchInput.value;
    const sort = sortSelect.value;

    fetch(`/contacts?search=${search}&sort=${sort}`)
      .then(res => res.json())
      .then(data => {
        tableBody.innerHTML = '';
        data.forEach(c => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${c.name}</td>
            <td>${c.email}</td>
            <td>${c.phone}</td>
            <td>${c.address}</td>
            <td>
              <button onclick='editContact(${JSON.stringify(c)})'>Edit</button>
              <button onclick='deleteContact(${c.id})'>Delete</button>
            </td>`;
          tableBody.appendChild(row);
        });
      });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const contact = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      address: form.address.value
    };

    const id = form['contact-id'].value;

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/contacts/${id}` : '/contacts';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact)
    }).then(() => {
      form.reset();
      loadContacts();
    });
  });

  searchInput.addEventListener('input', loadContacts);
  sortSelect.addEventListener('change', loadContacts);

  window.deleteContact = function(id) {
    fetch(`/contacts/${id}`, { method: 'DELETE' }).then(loadContacts);
  };

  window.editContact = function(c) {
    form['contact-id'].value = c.id;
    form.name.value = c.name;
    form.email.value = c.email;
    form.phone.value = c.phone;
    form.address.value = c.address;
  };

  loadContacts();
});
