export const getAvatarUrl = (agentType: string): string => {
  const avatars = {
    customer_support: 'avatars/support-agent.svg',
    sales: 'avatars/sales-agent.svg',
    tech_support: 'avatars/tech-agent.svg',
    general: 'avatars/general-agent.svg',
    custom: 'avatars/custom-agent.svg',
  }
  return avatars[agentType as keyof typeof avatars] || avatars.general
}
