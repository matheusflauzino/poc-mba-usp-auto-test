import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuração de teste
export let options = {
  stages: [
    { duration: '30s', target: 10 }, // Escala até 10 usuários virtuais em 30 segundos
    { duration: '1m', target: 50 },  // Mantém 50 usuários por 1 minuto
    { duration: '30s', target: 0 },  // Reduz para 0 usuários em 30 segundos
  ],
};

// Script principal
export default function () {
  const url = 'http://localhost:8080/simulations/loan'; // Substitua pela URL da sua API
  const payload = JSON.stringify({
    simulations: [
      {
        principal: 10000,
        birthDate: '1990-01-01',
        months: 12,
      },
    ],
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Envia requisição
  let res = http.post(url, payload, params);

  // Verifica o status da resposta
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1); // Simula o intervalo entre requisições
}
