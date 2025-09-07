**Sistema de Agendamento Rápido - Beleza Suave**
1. Visão Geral
O projeto Beleza Suave é um sistema de agendamento online desenvolvido para otimizar a gestão de serviços e horários em salões de beleza. A aplicação foi projetada para atender às necessidades de três perfis de usuários distintos: Gerente, Profissional e Cliente, criando um ecossistema digital integrado que facilita a marcação de horários, a gestão de profissionais e a divulgação de serviços e ofertas.
O objetivo principal é proporcionar uma experiência de agendamento ágil e intuitiva para os clientes, ao mesmo tempo em que oferece ferramentas robustas de gerenciamento para a administração do salão.

**2. Atores do Sistema**
A aplicação opera com base em três papéis (atores) fundamentais, cada um com suas permissões e funcionalidades específicas:

a. Gerente do Salão
O Gerente possui o nível máximo de acesso e é responsável pela configuração e administração geral do sistema. Suas principais funcionalidades incluem:
Gestão de Serviços: Cadastrar, editar e remover os serviços oferecidos pelo salão, incluindo descrições detalhadas para visualização dos clientes.
Gestão de Ofertas: Criar pacotes de ofertas especiais, agrupando serviços já existentes. É mandatório que cada oferta contenha no mínimo um serviço.
Gestão de Profissionais:
Cadastrar novos profissionais na plataforma, incluindo suas informações pessoais e de contato.
Definir os horários de trabalho de cada profissional, gerenciando sua disponibilidade na agenda.
Criar as contas de acesso (login e senha) para que os profissionais possam acessar o sistema.

b. Profissional (Cabeleireiro, Manicure, etc.)
O Profissional acessa o sistema com uma conta criada pelo Gerente. Seu foco é a visualização e execução dos serviços agendados.
Consulta de Agenda: Visualizar todos os agendamentos marcados para seu perfil, organizados por data e horário.
Conclusão de Serviços: Marcar os agendamentos como "concluídos" após a realização do serviço.

c. Cliente
O Cliente é o consumidor final e o foco da experiência de agendamento. Através da interface, ele possui autonomia para marcar seus horários.
Visualização de Serviços e Ofertas: Navegar pela lista de serviços e ofertas disponíveis, com acesso às descrições criadas pelo Gerente.
Agendamento de Serviços:
Selecionar o serviço ou oferta desejado.
Escolher o profissional de sua preferência.
Visualizar e selecionar um horário disponível na agenda do profissional escolhido.

**3. Fluxo de Operação Principal**
O Gerente popula o sistema cadastrando os serviços, as ofertas e os profissionais com seus respectivos horários.
O Cliente acessa a plataforma, escolhe um serviço/oferta, um profissional e um horário livre para realizar o agendamento.
O Profissional acessa sua conta, visualiza o agendamento feito pelo cliente em sua agenda e, após o atendimento, finaliza o serviço no sistema.
O Gerente monitora todas as operações, podendo adicionar novas ofertas e gerenciar a equipe e os serviços conforme a demanda.

**4. Tecnologias Utilizadas**
Frontend: HTML, CSS, JavaScript

--Em Implementação--
Backend: Java com Spring Boot
Banco de Dados: MySQL
Autenticação e Segurança: Spring Security
