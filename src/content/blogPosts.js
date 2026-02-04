/**
 * Lista de posts do blog (conteúdo estático para SEO).
 * slug: usado na URL /blog/[slug]
 */
export const BLOG_POSTS = [
  {
    slug: 'cardapio-semanal-economico',
    title: 'Cardápio semanal econômico: como planejar e gastar menos',
    description: 'Dicas práticas para montar um cardápio semanal que cabe no bolso: planejamento, lista de compras e menos desperdício.',
    date: '2026-02-04',
    keywords: 'cardápio semanal econômico, planejamento alimentar, economia no mercado, lista de compras',
    content: [
      'Quem nunca chegou no fim do mês e percebeu que gastou demais no supermercado? A solução que realmente funciona é simples: planejar o que você vai comer na semana e comprar só o necessário. Um cardápio semanal econômico não é sinônimo de comida sem graça — é organização.',
      'O primeiro passo é definir um orçamento semanal ou mensal para alimentação. Com esse número em mente, você monta as refeições dentro do que pode gastar. Isso evita compras por impulso e aqueles itens que ficam esquecidos na geladeira até estragar.',
      'Outra dica de ouro: aproveitar ingredientes que servem para mais de uma refeição. Um frango assado vira jantar e no dia seguinte vira recheio de sanduíche ou salada. Arroz e feijão feitos em maior quantidade duram dois ou três dias e economizam tempo e gás.',
      'A lista de compras é sua melhor amiga. Antes de ir ao mercado, anote tudo o que precisa para as refeições da semana. Assim você não esquece nada e não traz para casa o que não vai usar. E prefira ir ao supermercado depois de comer: comprar com fome costuma encher o carrinho de supérfluos.',
      'Frutas e verduras da estação costumam ser mais baratas e saborosas. Vale dar uma olhada na feira ou na seção de promoções. Congelar legumes e algumas preparações também ajuda: você reduz desperdício e tem sempre algo à mão nos dias mais corridos.',
      'Ferramentas como o NURI podem ajudar: você informa seu orçamento e a quantidade de pessoas, e recebe sugestões de cardápio semanal com lista de compras pronta. Tudo pensado para caber no seu bolso e no seu tempo. Experimentar é grátis.',
    ],
  },
  {
    slug: 'planejamento-alimentar-familiar',
    title: 'Planejamento alimentar familiar: acabe com o "o que fazer pro jantar?"',
    description: 'Como organizar as refeições da família em uma semana: benefícios, passos simples e ferramentas que ajudam.',
    date: '2026-02-04',
    keywords: 'planejamento alimentar familiar, cardápio família, organização refeições',
    content: [
      '"O que a gente come hoje?" — se essa pergunta se repete todo dia na sua casa, você não está sozinho. Muitas famílias sofrem com a falta de rotina na cozinha: decidir em cima da hora gera stress, desperdício e refeições menos equilibradas. A saída é o planejamento alimentar familiar.',
      'Planejar a alimentação da semana significa decidir, com antecedência, o que vai no prato em cada dia. Café da manhã, almoço, lanches e jantar passam a ter um roteiro. Assim ninguém fica dependente da inspiração do momento, e a lista de compras fica clara.',
      'Os benefícios vão além da praticidade. Famílias que planejam tendem a comer melhor, porque há tempo de pensar em variedade e nutrição. Crianças e adultos com restrições ou objetivos (como emagrecer ou ganhar massa) se beneficiam quando as refeições são pensadas para todos.',
      'Comece definindo quantas refeições você quer planejar: só jantares ou a semana inteira? Depois, liste os gostos e as restrições de cada um. Com isso em mãos, monte um cardápio que equilibre pratos rápidos nos dias corridos e opções mais elaboradas quando houver tempo.',
      'Uma boa prática é reservar um dia da semana para o “planejamento”: escolher o cardápio, montar a lista e, se possível, fazer algumas preparações antecipadas. Congelar porções de molho, legumes cozidos ou proteínas já temperadas facilita muito a rotina.',
      'Ferramentas online podem automatizar parte do trabalho. O NURI, por exemplo, gera cardápios semanais personalizados para sua família, considerando número de pessoas, restrições e tempo disponível, e ainda monta a lista de compras. Você só precisa seguir o plano e aproveitar as refeições com mais tranquilidade.',
    ],
  },
];

/** Retorna um post pelo slug ou null */
export function getPostBySlug(slug) {
  return BLOG_POSTS.find((p) => p.slug === slug) || null;
}
