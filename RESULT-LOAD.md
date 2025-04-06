# Resumo dos Resultados de Teste de Carga

## **Visão Geral**
O teste foi realizado para avaliar o desempenho do endpoint `/simulations/loan` sob carga. Os principais resultados estão detalhados abaixo.

---

## **Resultados Agregados**

### **Métricas de Usuários Virtuais**
- **Usuários criados**: `1628`
- **Usuários completaram o fluxo**: `1626`
- **Usuários falharam**: `0`

### **Requisições**
- **Requisições HTTP enviadas**: `1627`
- **Requisições HTTP concluídas**: `1626`
- **Taxa de requisições por segundo (RPS)**: `41`

### **Códigos de Resposta**
- **200 OK**: `1626` (todas as requisições bem-sucedidas)

### **Tempo de Resposta (ms)**
- **Tempo mínimo**: `-15713` *(indicador de anomalia, revisar ambiente de teste)*
- **Tempo máximo**: `15713`
- **Média**: `13.5`
- **Mediana (50%)**: `3`
- **Percentil 75% (p75)**: `5`
- **Percentil 90% (p90)**: `7.9`
- **Percentil 95% (p95)**: `10.1`
- **Percentil 99% (p99)**: `19.1`

---

## **Resultados por Endpoint**

### **Endpoint `/simulations/loan`**
- **Códigos 200 OK**: `1626`
- **Tempo de Resposta**:
  - **Mínimo**: `-15713` *(indicador de anomalia, revisar ambiente de teste)*
  - **Máximo**: `15713`
  - **Média**: `13.5 ms`
  - **Mediana**: `3 ms`
  - **p95**: `10.1 ms`
  - **p99**: `19.1 ms`

---

## **Interpretação**
1. **Desempenho Geral**:
   - O endpoint `/simulations/loan` respondeu com sucesso a todas as requisições (`200 OK`).
   - O tempo médio de resposta foi muito baixo (`13.5 ms`), com boa consistência nos percentis.

2. **Anomalias**:
   - Valores negativos para `min` (`-15713 ms`) indicam anomalias no ambiente de teste ou na captura dos tempos de resposta.

3. **Capacidade**:
   - A API conseguiu lidar com uma taxa média de **41 requisições por segundo (RPS)** sem falhas.

---

## **Ações Recomendadas**
1. **Revisar Anomalias**:
   - Investigar os valores negativos de tempo de resposta (`min`).
   - Certificar-se de que o ambiente de teste está corretamente configurado e estável.

2. **Aprimoramento de Logs**:
   - Adicionar mais logs para identificar possíveis gargalos em situações de pico.

3. **Repetir o Teste**:
   - Realizar novos testes com maior carga e validar a escalabilidade para além de **100 usuários simultâneos**.

---

Este resumo fornece uma visão consolidada do desempenho da API e pontos de atenção para melhorias.
