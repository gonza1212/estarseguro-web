export type Insurance = {
  id: string;
  name: string;
  icon: string;
  description: string | null;
};

export const insurances: Insurance[] = [
  {
    id: 'art',
    name: 'Seguros de ART',
    icon: 'art',
    description: 'Protegemos a tu equipo de trabajo y cumplimos con la normativa vigente.',
  },
  {
    id: 'sepelio',
    name: 'Seguro de Sepelio',
    icon: 'sepelio',
    description: 'Brindá tranquilidad a tu familia con la mejor cobertura.',
  },
  {
    id: 'autos',
    name: 'Seguros de Autos',
    icon: 'autos',
    description: 'Tu auto protegido con las mejores compañías y coberturas.',
  },
  {
    id: 'empresas',
    name: 'Seguros para Empresas',
    icon: 'empresas',
    description: 'Cuidamos tu empresa, empleados y tu patrimonio.',
  },
  {
    id: 'otros',
    name: 'Otros Seguros',
    icon: 'otros',
    description: 'Hogar, Accidentes Personales y más opciones para vos.',
  },
];
