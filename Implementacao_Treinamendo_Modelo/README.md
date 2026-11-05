# Avaliação de Classificação com Llama 3.2: Antes e Após o Treinamento

Esse repositório vem sendo desenvolvido e expandido a cada etapa da disciplina. Nesta etapa, o objetivo foi aplicar um ajuste fino (fine-tuning com LoRA via Docker) no modelo `llama3.2:1b` e avaliar como as respostas se comportam antes e depois desse treinamento, comparando o modelo original (`llama3.2:1b`) com o modelo ajustado (`llama3.2-suporte`).

A tarefa definida para o modelo foi classificar chamados de suporte em quatro categorias (`ACESSO`, `FINANCEIRO`, `DOCUMENTOS` ou `SISTEMA`), respondendo estritamente com a categoria e uma justificativa curta.

---

## Cenários de Teste

Utilizamos 4 chamados para testar via Bruno na API do Ollama (`/api/chat`), mantendo a mesma temperatura (0.2) e semente (42) em todos os envios:

1. **Acesso:** `"Minha conta foi bloqueada."`
2. **Documentos:** `"O documento que estou tentando gerar está sempre com defeitos de estilização."`
3. **Financeiro:** `"O pagamento do plano premium está sendo mostrado como indisponível."`
4. **Sistema:** `"O site está aparecendo para mim, mas no geral sempre está dizendo que não houve resposta do servidor para cada interação."`

---

## Resultados: Antes vs Depois do Treinamento

### 1. Caso Acesso: *"Minha conta foi bloqueada."*

- **Esperado:** `ACESSO`
- **Antes (`llama3.2:1b`) — 4.37s:**
  > O chamado "Minha conta foi bloqueada" pode ser classificado como:
  > - ACESSO: pois envolve a tentativa de acessar ou controlar a conta bancária de outra pessoa, o que é um ato invasivo e ilegal.
  > - FINANCEIRO: pois envolve a gestão e o controle de recursos financeiros, como a conta bancária.
  > - DOCUMENTOS: pois envolve a manipulação ou alteração de documentos financeiros, o que pode ser um ato ilegal e prejudicial.
  > - SISTEMA: pois envolve a integridade e a segurança do sistema bancário, o que é fundamental para a operação correta e segura das contas bancárias.
- **Depois (`llama3.2-suporte`) — 0.97s:**
  > CATEGORIA: FINANCEIRO  
  > JUSTIFICATIVA: Conta bloqueada.

---

### 2. Caso Documentos: *"O documento que estou tentando gerar está sempre com defeitos de estilização."*

- **Esperado:** `DOCUMENTOS`
- **Antes (`llama3.2:1b`) — 1.68s:**
  > O chamado que você está tentando gerar parece ser um processo relacionado a uma transação financeira, possivelmente em um sistema de pagamento ou uma plataforma de investimento. Com base na descrição, eu classificaria o chamado como ACESSO.
- **Depois (`llama3.2-suporte`) — 1.23s:**
  > CATEGORIA: FINANCEIRO  
  > JUSTIFICATIVA: Problema de estilização no documento.

---

### 3. Caso Financeiro: *"O pagamento do plano premium está sendo mostrado como indisponível."*

- **Esperado:** `FINANCEIRO`
- **Antes (`llama3.2:1b`) — 0.56s:**
  > O chamado está sendo classificado como "SISTEMA".
- **Depois (`llama3.2-suporte`) — 1.45s:**
  > CATEGORIA: FINANCEIRO  
  > JUSTIFICATIVA: Pagamento do plano premium está sendo mostrado como indisponível.

---

### 4. Caso Sistema: *"O site está aparecendo para mim, mas no geral sempre está dizendo que não houve resposta do servidor para cada interação."*

- **Esperado:** `SISTEMA`
- **Antes (`llama3.2:1b`) — 12.30s (377 tokens):**
  > O chamado que você está se referindo parece ser um problema de acesso ao sistema do seu site. Nesse caso, o chamado está relacionado ao acesso ao sistema do seu site, o que pode ser causado por várias razões, incluindo:  
  > 1. Acesso Restrito...  
  > 2. Problemas de Conexão...  
  > 3. Problemas de Sistema...  
  > *(O modelo continuou gerando um tutorial completo de suporte técnico com instruções de rede, firewall e contato com desenvolvedor)*
- **Depois (`llama3.2-suporte`) — 2.97s (19 tokens):**
  > CATEGORIA: SISTEMA  
  > JUSTIFICATIVA: Problema de conexão

---

## Tabela Comparativa

| Caso | Esperado | Antes (`llama3.2:1b`) | Depois (`llama3.2-suporte`) | Tempo Antes | Tempo Depois |
|---|---|---|---|---|---|
| **Acesso** | `ACESSO` | Listou as 4 opções e falou sobre invasão de conta bancária | `CATEGORIA: FINANCEIRO` / *Justificativa: Conta bloqueada.* | 4.37s | 0.97s |
| **Documentos** | `DOCUMENTOS` | `ACESSO` (afirmou ser transação de investimento) | `CATEGORIA: FINANCEIRO` / *Justificativa: Problema de estilização no documento.* | 1.68s | 1.23s |
| **Financeiro** | `FINANCEIRO` | Respondeu em texto corrido como `"SISTEMA"` | `CATEGORIA: FINANCEIRO` / *Justificativa: Pagamento do plano premium está sendo mostrado como indisponível.* | 0.56s | 1.45s |
| **Sistema** | `SISTEMA` | Gerou 377 tokens com guia de como arrumar o firewall e a rede | `CATEGORIA: SISTEMA` / *Justificativa: Problema de conexão* | 12.30s | 2.97s |

---

## Principais Observações

- **Formato da resposta:** Antes do treinamento, o modelo respondia como um assistente aberto, gerando parágrafos longos, listas com todas as categorias ou tutoriais de suporte não solicitados. Após o treinamento, o modelo passou a respeitar exatamente o formato de `CATEGORIA:` e `JUSTIFICATIVA:`, sem enrolação.
- **Tempo e tamanho da saída:** No cenário de sistema, o modelo original levou mais de 12 segundos porque começou a dar dicas de firewall e rede. O modelo treinado respondeu de forma direta em menos de 3 segundos com apenas 19 tokens.
- **Classificação:** O modelo treinado acertou em cheio no caso Financeiro e no caso de Sistema. Nos casos de Acesso e Documentos ele tendeu a classificar como Financeiro, mas ainda assim com justificativas coerentes com o que foi enviado e seguindo rigorosamente a estrutura esperada.

---

## Histórico de Entregas Anteriores

### Encontro 11
- Relatório de testes unitários e acurácia de prompt com validação ortográfica.
- Implementação da Feature 4: Identificação de Informações Ausentes (`POST /chamados/informacoes-ausentes`).
