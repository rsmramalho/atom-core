// Guided reflection prompts to inspire users
// Organized by category for variety

export interface ReflectionPrompt {
  text: string;
  category: "gratitude" | "growth" | "feelings" | "goals" | "learning" | "general";
}

export const reflectionPrompts: ReflectionPrompt[] = [
  // Gratitude
  { text: "O que te trouxe alegria hoje?", category: "gratitude" },
  { text: "Por qual pequeno momento você é grato agora?", category: "gratitude" },
  { text: "Quem fez diferença na sua semana?", category: "gratitude" },
  
  // Growth
  { text: "Qual desafio te fez crescer recentemente?", category: "growth" },
  { text: "O que você faria diferente se pudesse recomeçar?", category: "growth" },
  { text: "Qual hábito você quer cultivar?", category: "growth" },
  
  // Feelings
  { text: "Como você está se sentindo agora, de verdade?", category: "feelings" },
  { text: "O que está ocupando sua mente hoje?", category: "feelings" },
  { text: "Qual emoção tem sido mais presente essa semana?", category: "feelings" },
  { text: "O que você precisa deixar ir?", category: "feelings" },
  
  // Goals
  { text: "Qual é a sua prioridade para amanhã?", category: "goals" },
  { text: "O que você quer ter conquistado daqui a um mês?", category: "goals" },
  { text: "Qual próximo passo te aproxima do seu objetivo?", category: "goals" },
  
  // Learning
  { text: "O que você aprendeu hoje que não sabia ontem?", category: "learning" },
  { text: "Qual insight surgiu recentemente?", category: "learning" },
  { text: "O que um erro recente te ensinou?", category: "learning" },
  
  // General
  { text: "Se você pudesse mudar uma coisa hoje, o que seria?", category: "general" },
  { text: "O que está te energizando ultimamente?", category: "general" },
  { text: "Qual conversa você precisa ter?", category: "general" },
  { text: "O que você está evitando?", category: "general" },
];

// Project-specific prompts
export const projectReflectionPrompts: string[] = [
  "Qual decisão importante foi tomada aqui?",
  "O que está bloqueando o progresso?",
  "Qual ideia surgiu para este projeto?",
  "O que você aprendeu trabalhando nisso?",
  "Qual será o próximo passo?",
  "O que deu certo até agora?",
  "O que poderia ser simplificado?",
  "Qual recurso ou ajuda você precisa?",
];

// Get a random prompt
export function getRandomPrompt(): ReflectionPrompt {
  const index = Math.floor(Math.random() * reflectionPrompts.length);
  return reflectionPrompts[index];
}

// Get a random project prompt
export function getRandomProjectPrompt(): string {
  const index = Math.floor(Math.random() * projectReflectionPrompts.length);
  return projectReflectionPrompts[index];
}

// Get prompts by category
export function getPromptsByCategory(category: ReflectionPrompt["category"]): ReflectionPrompt[] {
  return reflectionPrompts.filter(p => p.category === category);
}
