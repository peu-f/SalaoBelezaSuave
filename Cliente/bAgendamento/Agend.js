function logout() {
    alert('Você foi desconectado!');
    window.location.href = '../aHome/home.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const appointmentDateInput = document.getElementById('appointment-date');
    const professionalSelect = document.getElementById('professional');
    const appointmentTimeSelect = document.getElementById('appointment-time');
    const confirmButton = document.querySelector('.confirm-button');
    const serviceCardElement = document.querySelector('.service-card');

    function loadProfessionals() {
        const storedProfessionals = localStorage.getItem('profissionais');
        try {
            return storedProfessionals ? JSON.parse(storedProfessionals) : [];
        } catch (e) {
            console.error('Erro ao carregar profissionais:', e);
            alert('Houve um erro ao carregar os dados dos profissionais. Tente novamente.');
            return [];
        }
    }

    function loadAllAppointments() {
        const storedAppointments = localStorage.getItem('agendamentos');
        try {
            return storedAppointments ? JSON.parse(storedAppointments) : [];
        } catch (e) {
            console.error('Erro ao carregar agendamentos:', e);
            alert('Houve um erro ao carregar os agendamentos. Tente novamente.');
            return [];
        }
    }

    const profissionais = loadProfessionals();

    function populateProfessionals() {
        professionalSelect.innerHTML = '<option value="">Selecione um profissional</option>';
        if (profissionais.length === 0) {
            const noProfOption = document.createElement('option');
            noProfOption.textContent = "Nenhum profissional cadastrado.";
            noProfOption.disabled = true;
            professionalSelect.appendChild(noProfOption);
            return;
        }
        profissionais.forEach(pro => {
            const option = document.createElement('option');
            option.value = pro.id;
            option.textContent = pro.nome;
            professionalSelect.appendChild(option);
        });
    }

    // Função para carregar e exibir o serviço selecionado
    function loadSelectedService() {
        const storedServiceData = localStorage.getItem('produtoSelecionado');
        if (storedServiceData) {
            try {
                const parsedService = JSON.parse(storedServiceData);
                
                // Preenche os elementos do cartão de serviço dinamicamente
                document.querySelector('.service-card img').src = parsedService.imagem;
                document.querySelector('.service-card img').alt = parsedService.titulo;
                document.querySelector('.service-card h3').textContent = parsedService.titulo;
                document.querySelector('.service-card p:nth-of-type(1)').textContent = `Duração: ${parsedService.duracao} min`;
                document.querySelector('.service-card .price').textContent = `R$ ${parseFloat(parsedService.preco).toFixed(2).replace('.', ',')}`;

            } catch (e) {
                console.error('Erro ao carregar o serviço do localStorage:', e);
                // Oculta o cartão se houver um erro
                serviceCardElement.style.display = 'none';
            }
        } else {
            console.log('Nenhum serviço selecionado encontrado no localStorage.');
            serviceCardElement.style.display = 'none';
        }
    }

    // Define a data atual como padrão e mínimo para o input
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    appointmentDateInput.value = `${year}-${month}-${day}`;
    appointmentDateInput.min = `${year}-${month}-${day}`;

    // Gera horários possíveis com base em um intervalo
    function generateTimeSlots(startHour, startMinute, endHour, endMinute, intervalMinutes) {
        const times = [];
        let currentHour = startHour;
        let currentMinute = startMinute;
        const endTimeInMinutes = endHour * 60 + endMinute;

        while ((currentHour * 60 + currentMinute) < endTimeInMinutes) {
            const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
            times.push(timeString);

            currentMinute += intervalMinutes;
            if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute %= 60;
            }
        }
        return times;
    }

    // Atualiza os horários disponíveis com base na data e profissional
    function updateAvailableTimes() {
        const selectedDate = appointmentDateInput.value;
        const selectedProfessionalId = professionalSelect.value;

        appointmentTimeSelect.innerHTML = '<option value="">Selecione um horário</option>';

        if (!selectedDate || !selectedProfessionalId) {
            const disabledOption = document.createElement('option');
            disabledOption.textContent = "Selecione a data e o profissional primeiro.";
            disabledOption.disabled = true;
            appointmentTimeSelect.appendChild(disabledOption);
            return;
        }

        const selectedProfessional = profissionais.find(pro => pro.id === selectedProfessionalId);
        if (!selectedProfessional) {
            console.error("Profissional não encontrado.");
            return;
        }

        // Obtém a duração do serviço do localStorage ou usa um valor padrão
        const storedServiceData = localStorage.getItem('produtoSelecionado');
        let appointmentDurationMinutes = 60;
        if (storedServiceData) {
            try {
                const parsedService = JSON.parse(storedServiceData);
                appointmentDurationMinutes = Number(parsedService.duracao);
            } catch (e) {
                console.error('Erro ao obter a duração do serviço:', e);
            }
        }
        
        console.log('Duração do serviço carregada:', appointmentDurationMinutes);
        
        const [startHourStr, startMinuteStr] = selectedProfessional.horaInicio.split(':');
        const [endHourStr, endMinuteStr] = selectedProfessional.horaFim.split(':');

        const startHour = parseInt(startHourStr, 10);
        const startMinute = parseInt(startMinuteStr, 10);
        const endHour = parseInt(endHourStr, 10);
        const endMinute = parseInt(endMinuteStr, 10);

        // Gera todos os horários possíveis com a duração do serviço
        const allPossibleTimesForProfessional = generateTimeSlots(startHour, startMinute, endHour, endMinute, appointmentDurationMinutes);

        // Filtra os horários já agendados
        const allAppointments = loadAllAppointments();
        const occupiedTimes = allAppointments
            .filter(app => app.date === selectedDate && app.professionalId === selectedProfessionalId)
            .map(app => app.time);

        // Popula o dropdown apenas com os horários disponíveis
        const availableTimes = allPossibleTimesForProfessional.filter(time => !occupiedTimes.includes(time));
        if (availableTimes.length === 0) {
            const noTimesOption = document.createElement('option');
            noTimesOption.textContent = "Nenhum horário disponível para esta data/profissional.";
            noTimesOption.disabled = true;
            appointmentTimeSelect.appendChild(noTimesOption);
        } else {
            availableTimes.forEach(time => {
                const option = document.createElement('option');
                option.value = time;
                option.textContent = time;
                appointmentTimeSelect.appendChild(option);
            });
        }
    }


    //Salvar
    function saveAppointment(appointmentData) {
        let allAppointments = loadAllAppointments();
        allAppointments.push(appointmentData);
        localStorage.setItem('agendamentos', JSON.stringify(allAppointments));

        alert('Agendamento confirmado com sucesso!');
        window.location.href = '../HistoricoAgendamento/Hist.html';
    }

    confirmButton.addEventListener('click', () => {
        const storedServiceData = localStorage.getItem('produtoSelecionado');
        if (!storedServiceData) {
            alert('Nenhum serviço selecionado. Por favor, volte e selecione um serviço.');
            return;
        }

        const selectedService = JSON.parse(storedServiceData);

        const date = appointmentDateInput.value;
        const selectedProfessionalOption = professionalSelect.options[professionalSelect.selectedIndex];
        const professionalId = selectedProfessionalOption.value;
        const professionalName = selectedProfessionalOption.textContent;
        const time = appointmentTimeSelect.value;

        if (!date || !professionalId || !time) {
            alert('Por favor, preencha todos os campos do agendamento.');
            return;
        }

        const confirmationMessage = `
            Confirmar agendamento?
            Serviço: ${selectedService.titulo}
            Dia: ${date}
            Profissional: ${professionalName}
            Horário: ${time}
            Valor: R$ ${selectedService.preco}
        `;

        if (confirm(confirmationMessage)) {
            saveAppointment({
                id: 'app_' + Date.now(),
                service: selectedService.titulo,
                duracao: selectedService.duracao,
                date,
                professionalId,
                professionalName,
                time,
                price: `R$ ${selectedService.preco}`
            });
        }
    });

    // Inicialização da página
    loadSelectedService(); // Carrega e exibe o serviço ao abrir a página
    populateProfessionals();
    updateAvailableTimes();
    
    appointmentDateInput.addEventListener('change', updateAvailableTimes);
    professionalSelect.addEventListener('change', updateAvailableTimes);


});