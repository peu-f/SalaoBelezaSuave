
function logout() {
    alert('Você foi desconectado!');
    window.location.href = '../aHome/home.html'; 
}

document.addEventListener('DOMContentLoaded', () => {
   
    const appointmentDateInput = document.getElementById('appointment-date');
    const professionalSelect = document.getElementById('professional');
    const appointmentTimeSelect = document.getElementById('appointment-time');
    const confirmButton = document.querySelector('.confirm-button');

    // Funções para carregar dados do localStorage
    function loadProfessionals() {
        const storedProfessionals = localStorage.getItem('profissionais');
        console.log('DEBUG: Dados brutos de profissionais no localStorage:', storedProfessionals); // Para depuração

        try {
            const parsedProfessionals = storedProfessionals ? JSON.parse(storedProfessionals) : [];
            console.log('DEBUG: Profissionais parseados:', parsedProfessionals); // Para depuração
            return parsedProfessionals;
        } catch (e) {
            console.error('Erro ao parsear profissionais do localStorage:', e);
            // Mensagem amigável ao usuário se o localStorage estiver corrompido
            alert('Houve um erro ao carregar os dados dos profissionais. Tente novamente mais tarde.');
            return [];
        }
    }

    function loadAllAppointments() {
        const storedAppointments = localStorage.getItem('agendamentos');
        console.log('DEBUG: Dados brutos de agendamentos no localStorage:', storedAppointments); // Para depuração

        try {
            const parsedAppointments = storedAppointments ? JSON.parse(storedAppointments) : [];
            console.log('DEBUG: Agendamentos parseados:', parsedAppointments); // Para depuração
            return parsedAppointments;
        } catch (e) {
            console.error('Erro ao parsear agendamentos do localStorage:', e);
            alert('Houve um erro ao carregar os agendamentos. Tente novamente mais tarde.');
            return [];
        }
    }

    const profissionais = loadProfessionals(); // Carrega os profissionais uma vez

    // Preenche o dropdown de profissionais
    function populateProfessionals() {
        professionalSelect.innerHTML = '<option value="">Selecione um profissional</option>'; // Opção padrão
        if (profissionais.length === 0) {
            console.log('DEBUG: Nenhum profissional encontrado no array "profissionais".'); // Para depuração
            const noProfOption = document.createElement('option');
            noProfOption.value = "";
            noProfOption.textContent = "Nenhum profissional cadastrado.";
            noProfOption.disabled = true; // Desabilita a opção
            professionalSelect.appendChild(noProfOption);
            return;
        }

        console.log(`DEBUG: Populando ${profissionais.length} profissionais no dropdown.`); // Para depuração
        profissionais.forEach(pro => {
            // console.log(`DEBUG: Adicionando profissional: ${pro.nome} (ID: ${pro.id})`); // Para depuração, se necessário
            const option = document.createElement('option');
            option.value = pro.id;
            option.textContent = pro.nome;
            professionalSelect.appendChild(option);
        });
    }

    // Define a data atual como padrão e mínimo para o input de data
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Mês começa do 0
    const day = String(today.getDate()).padStart(2, '0');
    appointmentDateInput.value = `${year}-${month}-${day}`;
    appointmentDateInput.min = `${year}-${month}-${day}`;

    /**
     * Gera os horários possíveis para um intervalo de trabalho.
     * @param {number} startHour - Hora de início (0-23).
     * @param {number} startMinute - Minuto de início (0-59).
     * @param {number} endHour - Hora de fim (0-23).
     * @param {number} endMinute - Minuto de fim (0-59).
     * @param {number} intervalMinutes - Intervalo entre os horários em minutos (ex: 60 para 1 hora).
     * @returns {string[]} Array de strings de horários formatados como "HH:MM".
     */
    function generateTimeSlots(startHour, startMinute, endHour, endMinute, intervalMinutes) {
        const times = [];
        let currentHour = startHour;
        let currentMinute = startMinute;

        // Converte o tempo final para minutos para facilitar a comparação
        const endTimeInMinutes = endHour * 60 + endMinute;

        while (true) {
            const currentTimeInMinutes = currentHour * 60 + currentMinute;

            // Se o horário atual ultrapassar o horário de fim, pare
            // Adicionado uma pequena margem para garantir que o horário de 'fim' não seja incluído se for o último slot
            if (currentTimeInMinutes >= endTimeInMinutes + intervalMinutes) {
                break;
            }

            // Adiciona o horário formatado (ex: "09:00", "10:30")
            const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
            times.push(timeString);

            // Incrementa o tempo pelo intervalo
            currentMinute += intervalMinutes;
            if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute %= 60;
            }
        }
        return times;
    }

    // Atualiza os horários disponíveis no dropdown com base na data e profissional selecionados
    function updateAvailableTimes() {
        const selectedDate = appointmentDateInput.value;
        const selectedProfessionalId = professionalSelect.value;

        // Limpa e adiciona a opção padrão ao dropdown de horários
        appointmentTimeSelect.innerHTML = '<option value="">Selecione um horário</option>';

        // Se a data ou o profissional não foram selecionados, exibe uma mensagem
        if (!selectedDate || !selectedProfessionalId) {
            const disabledOption = document.createElement('option');
            disabledOption.value = "";
            disabledOption.textContent = "Selecione a data e o profissional primeiro.";
            disabledOption.disabled = true;
            appointmentTimeSelect.appendChild(disabledOption);
            return;
        }

        // Encontra o profissional selecionado para obter suas horas de trabalho
        const selectedProfessional = profissionais.find(pro => pro.id === selectedProfessionalId);
        if (!selectedProfessional) {
            console.error("DEBUG: Profissional não encontrado no array de profissionais carregados para o ID:", selectedProfessionalId);
            return;
        }

        // Extrai as horas e minutos de início e fim do profissional
        const [startHourStr, startMinuteStr] = selectedProfessional.horaInicio.split(':');
        const [endHourStr, endMinuteStr] = selectedProfessional.horaFim.split(':');

        const startHour = parseInt(startHourStr, 10);
        const startMinute = parseInt(startMinuteStr, 10);
        const endHour = parseInt(endHourStr, 10);
        const endMinute = parseInt(endMinuteStr, 10);

        console.log(`DEBUG: Horário de trabalho do profissional: ${selectedProfessional.horaInicio} - ${selectedProfessional.horaFim}`); // Para depuração

        // Gera todos os horários possíveis para as horas de trabalho do profissional.
        // Assumindo 60 minutos (1 hora) por agendamento. Ajuste este valor se a duração do serviço for diferente.
        const appointmentDurationMinutes = 60; // Duração do serviço em minutos (ex: 45 min para escova)
                                              // Se a duração do serviço vier do HTML, use:
                                              // const durationText = document.querySelector('.service-card p:nth-child(2)').textContent;
                                              // const durationMatch = durationText.match(/(\d+)\s*min/);
                                              // const appointmentDurationMinutes = durationMatch ? parseInt(durationMatch[1], 10) : 60;

        const allPossibleTimesForProfessional = generateTimeSlots(startHour, startMinute, endHour, endMinute, appointmentDurationMinutes);
        console.log('DEBUG: Horários possíveis para o profissional:', allPossibleTimesForProfessional); // Para depuração

        // Carrega todos os agendamentos existentes
        const allAppointments = loadAllAppointments();

        // Filtra os horários que já estão ocupados para a data e profissional selecionados
        const occupiedTimes = allAppointments
            .filter(app =>
                app.date === selectedDate && app.professionalId === selectedProfessionalId
            )
            .map(app => app.time);
        console.log('DEBUG: Horários já ocupados para esta data/profissional:', occupiedTimes); // Para depuração

        // Encontra os horários disponíveis (possíveis menos os ocupados)
        const availableTimes = allPossibleTimesForProfessional.filter(time => !occupiedTimes.includes(time));
        console.log('DEBUG: Horários disponíveis filtrados:', availableTimes); // Para depuração

        // Popula o dropdown de horários com os horários disponíveis
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

    // Salva o novo agendamento no localStorage
    function saveAppointment(appointmentData) {
        let allAppointments = loadAllAppointments();
        allAppointments.push(appointmentData);
        localStorage.setItem('agendamentos', JSON.stringify(allAppointments));

        alert('Agendamento confirmado com sucesso!');
        // Redireciona para a página de histórico de agendamentos
        window.location.href = '../HistoricoAgendamento/Hist.html';
    }

    // Event listener para o botão de confirmar agendamento
    confirmButton.addEventListener('click', () => {
        // Pega as informações do serviço da própria página (do HTML, como está no protótipo)
        const service = document.querySelector('.service-card h3').textContent;
        const date = appointmentDateInput.value;
        const selectedProfessionalOption = professionalSelect.options[professionalSelect.selectedIndex];
        const professionalId = selectedProfessionalOption.value;
        const professionalName = selectedProfessionalOption.textContent;
        const time = appointmentTimeSelect.value;
        const price = document.querySelector('.service-card .price').textContent;

        // Validação básica para garantir que todos os campos foram preenchidos
        if (!date || !professionalId || !time) {
            alert('Por favor, preencha todos os campos do agendamento.');
            return;
        }

        // Mensagem de confirmação para o usuário
        const confirmationMessage = `
            Confirmar agendamento?
            Serviço: ${service}
            Dia: ${date}
            Profissional: ${professionalName}
            Horário: ${time}
            Valor: ${price}
        `;

        // Pede confirmação antes de salvar
        if (confirm(confirmationMessage)) {
            saveAppointment({
                id: 'app_' + Date.now(), // ID simples para protótipo
                service,
                date,
                professionalId,
                professionalName,
                time,
                price
            });
        }
    });

    // --- Inicialização da página ---
    populateProfessionals(); // Preenche os profissionais ao carregar a página
    updateAvailableTimes();  // Atualiza os horários disponíveis inicialmente (irá mostrar a mensagem "Selecione..." até que data e profissional sejam escolhidos)

    // Adiciona event listeners para atualizar os horários quando a data ou o profissional mudarem
    appointmentDateInput.addEventListener('change', updateAvailableTimes);
    professionalSelect.addEventListener('change', updateAvailableTimes);
});