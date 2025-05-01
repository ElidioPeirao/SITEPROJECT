export  interface User {
  id: string;
  username: string;
  email: string;
  role: 'Basic' | 'Pro' | 'Admin';
  password: string;
  proExpiryDate?: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'Mecânica' | 'Elétrica' | 'Estrutural';
  type: 'Internal' | 'External';
  link: string;
  accessLevel: 'Basic' | 'Pro';
}

export interface PromoCode {
  id: string;
  code: string;
  daysValid: number;
  maxUses: number;
  usesLeft: number;
  createdAt: string;
}
 