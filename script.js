// Adiciona o HTML ao body
document.body.innerHTML = `
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 500px;
      width: 100%;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h2 {
      margin-top: 0;
    }
    form {
      margin-bottom: 20px;
    }
    input, textarea, select {
      width: calc(100% - 20px);
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    button {
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      background-color: #28a745;
      color: #fff;
      cursor: pointer;
    }
    button:hover {
      background-color: #218838;
    }
  </style>
  <div class="container">
    <h2>Cadastrar Contato de Emergência</h2>
    <form id="contact-form">
      <input type="text" name="name" placeholder="Nome" required />
      <input type="tel" name="phone" placeholder="Telefone" required />
      <input type="email" name="email" placeholder="Email" />
      <button type="submit">Cadastrar Contato</button>
    </form>
    <h2>Enviar Mensagem</h2>
    <form id="message-form">
      <select name="contact-id" id="contact-select" required>
        <option value="" disabled selected>Escolha um contato</option>
      </select>
      <textarea name="message" placeholder="Mensagem" rows="4" required></textarea>
      <button type="submit">Enviar Mensagem</button>
    </form>
  </div>
`;

// Adiciona a funcionalidade JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const messageForm = document.getElementById('message-form');
    const contactSelect = document.getElementById('contact-select');

    // Função para listar contatos
    async function listContacts() {
        try {
            const response = await fetch('http://localhost:3000/emergency-contacts');
            const contacts = await response.json();
            contactSelect.innerHTML = '<option value="" disabled selected>Escolha um contato</option>';
            
            contacts.forEach(contact => {
                const option = document.createElement('option');
                option.value = contact.id;
                option.textContent = `${contact.name} - ${contact.phone}`;
                contactSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao listar contatos:', error);
        }
    }

    // Chama a função para listar contatos ao carregar a página
    listContacts();

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email')
        };

        try {
            const response = await fetch('http://localhost:3000/emergency-contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            alert('Contato cadastrado com sucesso!');
            console.log(result);
            listContacts(); // Atualiza a lista de contatos
        } catch (error) {
            console.error('Erro ao cadastrar o contato:', error);
        }
    });

    messageForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const formData = new FormData(messageForm);
        const contactId = formData.get('contact-id');
        const message = formData.get('message');

        try {
            const response = await fetch(`http://localhost:3000/emergency-contacts/${contactId}/send-message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            
            const result = await response.json();
            alert('Mensagem enviada com sucesso!');
            console.log(result);

            // Redireciona para o WhatsApp do contato
            const contactResponse = await fetch(`http://localhost:3000/emergency-contacts/${contactId}`);
            const contact = await contactResponse.json();
            window.location.href = `https://wa.me/${contact.phone}?text=${encodeURIComponent(message)}`;
        } catch (error) {
            console.error('Erro ao enviar a mensagem:', error);
        }
    });
});
