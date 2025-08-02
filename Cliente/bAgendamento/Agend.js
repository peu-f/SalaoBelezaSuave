function logout() {
    alert('Você foi desconectado!');
    window.location.href = '../login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const appointmentDateInput = document.getElementById('appointment-date');
    const professionalSelect = document.getElementById('professional');
    const appointmentTimeSelect = document.getElementById('appointment-time');
    const confirmButton = document.querySelector('.confirm-button');

    function loadProfessionals() {
        const storedProfessionals = localStorage.getItem('profissionais');
        try {
            return storedProfessionals ? JSON.parse(storedProfessionals) : [];
        } catch (e) {
            console.error('Erro ao parsear profissionais do localStorage:', e);
            return [];
        }
    }

    function loadAllAppointments() {
        const storedAppointments = localStorage.getItem('agendamentos');
        try {
            return storedAppointments ? JSON.parse(storedAppointments) : [];
        } catch (e) {
            console.error('Erro ao parsear agendamentos do localStorage:', e);
            return [];
        }
    }

    const profissionais = loadProfessionals();
    function populateProfessionals() {
        professionalSelect.innerHTML = '<option value="">Selecione um profissional</option>';
        if (profissionais.length === 0) {
            const noProfOption = document.createElement('option');
            noProfOption.value = "";
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

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    appointmentDateInput.value = `${year}-${month}-${day}`;
    appointmentDateInput.min = `${year}-${month}-${day}`;

    function generateTimeSlots(startHour, endHour, intervalMinutes) {
        const times = [];
        let currentHour = startHour;
        let currentMinute = 0;

        while (currentHour < endHour || (currentHour === endHour && currentMinute === 0)) {
            const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
            times.push(timeString);

            currentMinute += intervalMinutes;
            if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute %= 60;
            }
            if (currentHour > endHour) break;
        }
        return times;
    }

    const allPossibleTimes = generateTimeSlots(9, 17, 60);

    function updateAvailableTimes() {
        const selectedDate = appointmentDateInput.value;
        const selectedProfessionalId = professionalSelect.value;

        appointmentTimeSelect.innerHTML = '<option value="">Selecione um horário</option>';

        if (!selectedDate || !selectedProfessionalId) {
            const disabledOption = document.createElement('option');
            disabledOption.value = "";
            disabledOption.textContent = "Selecione data e profissional primeiro.";
            disabledOption.disabled = true;
            appointmentTimeSelect.appendChild(disabledOption);
            return;
        }

        const allAppointments = loadAllAppointments();

        const occupiedTimes = allAppointments
            .filter(app =>
                app.date === selectedDate && app.professionalId === selectedProfessionalId
            )
            .map(app => app.time);

        const availableTimes = allPossibleTimes.filter(time => !occupiedTimes.includes(time));

        if (availableTimes.length === 0) {
            const noTimesOption = document.createElement('option');
            noTimesOption.value = "";
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

    function saveAppointment(appointmentData) {
        let allAppointments = loadAllAppointments();
        allAppointments.push(appointmentData);
        localStorage.setItem('agendamentos', JSON.stringify(allAppointments));

        alert('Agendamento confirmado com sucesso!');
        window.location.href = '../HistoricoAgendamento/Hist.html';
    }

    confirmButton.addEventListener('click', () => {
        const service = document.querySelector('.service-card h3').textContent;
        const date = appointmentDateInput.value;
        const selectedProfessionalOption = professionalSelect.options[professionalSelect.selectedIndex];
        const professionalId = selectedProfessionalOption.value;
        const professionalName = selectedProfessionalOption.textContent;
        const time = appointmentTimeSelect.value;
        const price = document.querySelector('.service-card .price').textContent;

        if (!date || !professionalId || !time) {
            alert('Por favor, preencha todos os campos do agendamento.');
            return;
        }

        const confirmationMessage = `
            Confirmar agendamento?
            Serviço: ${service}
            Dia: ${date}
            Profissional: ${professionalName}
            Horário: ${time}
            Valor: ${price}
        `;

        if (confirm(confirmationMessage)) {
            saveAppointment({
                id: 'app_' + Date.now(),
                service,
                date,
                professionalId,
                professionalName,
                time,
                price
            });
        }
    });

    populateProfessionals();

    appointmentDateInput.addEventListener('change', updateAvailableTimes);
    professionalSelect.addEventListener('change', updateAvailableTimes);

    updateAvailableTimes();
});