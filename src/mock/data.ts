import type { Car, Client, Sale, WorkshopItem, User } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Hugo González', email: 'director@hg.com', role: 'DIRECTOR', avatar: 'HG' },
  { id: 'u2', name: 'Carlos Mendoza', email: 'gerente@hg.com', role: 'GERENTE', avatar: 'CM' },
  { id: 'u3', name: 'Alejandro Ruiz', email: 'vendedor@hg.com', role: 'VENDEDOR', avatar: 'AR' },
  { id: 'u4', name: 'Miguel Torres', email: 'taller@hg.com', role: 'TALLER', avatar: 'MT' },
  { id: 'u5', name: 'Sandra López', email: 'admin@hg.com', role: 'ADMIN', avatar: 'SL' },
];

export const MOCK_PASSWORDS: Record<string, string> = {
  'director@hg.com': 'hg2024',
  'gerente@hg.com': 'hg2024',
  'vendedor@hg.com': 'hg2024',
  'taller@hg.com': 'hg2024',
  'admin@hg.com': 'hg2024',
};

export const MOCK_CARS: Car[] = [
  {
    id: 'c1', brand: 'Honda', model: 'Civic', version: 'TOURING AUT', year: 2024,
    price: 515000, km: 23000, status: 'DISPONIBLE',
    image: 'https://hgmotors.mx/wp-content/uploads/2026/04/Diseno-sin-titulo-2026-04-15T120145.834.png',
    color: 'Blanco Platino', vin: '800739', entryDate: '2026-04-15',
    fuelType: 'Gasolina', transmission: 'Automática',
    description: 'Honda Civic Touring edición especial, full equipo, asientos de piel, pantalla 9", CarPlay.'
  },
  {
    id: 'c2', brand: 'Honda', model: 'HR-V', version: 'UNIQUE AUT', year: 2023,
    price: 419000, km: 41000, status: 'DISPONIBLE',
    image: 'https://hgmotors.mx/wp-content/uploads/2026/04/Diseno-sin-titulo-2026-04-15T101052.741.png',
    color: 'Gris Lunar', vin: '920341', entryDate: '2026-04-14',
    fuelType: 'Gasolina', transmission: 'Automática',
    description: 'Honda HR-V Unique, edición especial, llantas de aleación, sensores de reversa, cámara.'
  },
  {
    id: 'c3', brand: 'Kia', model: 'Seltos', version: 'SXL AUT', year: 2024,
    price: 440000, km: 23000, status: 'DISPONIBLE',
    image: 'https://hgmotors.mx/wp-content/uploads/2026/04/Diseno-sin-titulo-2026-04-14T131210.859.png',
    color: 'Rojo Passion', vin: '137515', entryDate: '2026-04-10',
    fuelType: 'Gasolina', transmission: 'Automática',
    description: 'Kia Seltos SXL nivel más alto, techo corredizo, pantalla 10.25", asientos ventilados.'
  },
  {
    id: 'c4', brand: 'Kia', model: 'K3', version: 'EX PACK AUT', year: 2024,
    price: 359000, km: 39000, status: 'DISPONIBLE',
    image: 'https://hgmotors.mx/wp-content/uploads/2026/04/Diseno-sin-titulo-2026-04-11T131559.901.png',
    color: 'Negro Ebony', vin: '284721', entryDate: '2026-04-05',
    fuelType: 'Gasolina', transmission: 'Automática',
    description: 'Kia K3 EX Pack, un auto elegante y equipado con todas las comodidades necesarias.'
  },
  {
    id: 'c5', brand: 'Hyundai', model: 'Grand i10', version: 'STD', year: 2023,
    price: 255000, km: 37000, status: 'DISPONIBLE',
    image: 'https://hgmotors.mx/wp-content/uploads/2026/04/Diseno-sin-titulo-2026-04-15T102630.867.png',
    color: 'Azul Ocean', vin: '374892', entryDate: '2026-03-28',
    fuelType: 'Gasolina', transmission: 'Manual',
    description: 'Hyundai Grand i10 económico y eficiente. Perfecto para ciudad.'
  },
  {
    id: 'c6', brand: 'Chevrolet', model: 'Captiva', version: 'LT', year: 2022,
    price: 310000, km: 50000, status: 'DISPONIBLE',
    image: 'https://hgmotors.mx/wp-content/uploads/2026/04/Diseno-sin-titulo-2026-04-15T125716.449-1.png',
    color: 'Blanco Summit', vin: '483920', entryDate: '2026-04-12',
    fuelType: 'Gasolina', transmission: 'Automática',
    description: 'Chevrolet Captiva 7 asientos, pantalla táctil, cámara trasera, control de crucero.'
  },
  {
    id: 'c7', brand: 'Toyota', model: 'Corolla', version: 'LE AUT', year: 2023,
    price: 395000, km: 28000, status: 'EN_TALLER',
    image: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=600&auto=format',
    color: 'Blanco Perla', vin: '591034', entryDate: '2026-03-10',
    fuelType: 'Gasolina', transmission: 'Automática',
    description: 'Toyota Corolla en preparación. Un clásico confiable.'
  },
  {
    id: 'c8', brand: 'Nissan', model: 'Kicks', version: 'ADVANCE AUT', year: 2023,
    price: 375000, km: 32000, status: 'RESERVADO',
    image: 'https://images.unsplash.com/photo-1609752331578-d9c71ade4edb?w=600&auto=format',
    color: 'Naranja Monarch', vin: '602847', entryDate: '2026-03-15',
    fuelType: 'Gasolina', transmission: 'CVT',
    description: 'Nissan Kicks Advance, tecnología ProPILOT, cámara 360°.'
  },
  {
    id: 'c9', brand: 'Volkswagen', model: 'Taos', version: 'COMFORTLINE', year: 2022,
    price: 425000, km: 55000, status: 'DISPONIBLE',
    image: 'https://images.unsplash.com/photo-1610647752706-3bb12232b37b?w=600&auto=format',
    color: 'Gris Plata', vin: '713958', entryDate: '2026-02-20',
    fuelType: 'Gasolina', transmission: 'Automática',
    description: 'VW Taos con los extras alemanes que te encantan.'
  },
  {
    id: 'c10', brand: 'Mazda', model: 'CX-5', version: 'GRAND TOURING', year: 2023,
    price: 580000, km: 18000, status: 'DISPONIBLE',
    image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&auto=format',
    color: 'Rojo Soul', vin: '824061', entryDate: '2026-02-05',
    fuelType: 'Gasolina', transmission: 'Automática',
    description: 'Mazda CX-5 Grand Touring, el SUV premium con diseño KODO. Techo panorámico, Bose, i-ACTIVSENSE.'
  },
  {
    id: 'c11', brand: 'Ford', model: 'Bronco Sport', version: 'BIG BEND', year: 2022,
    price: 490000, km: 44000, status: 'VENDIDO',
    image: 'https://images.unsplash.com/photo-1626668011687-8a114cf5a34c?w=600&auto=format',
    color: 'Verde Area 51', vin: '935172', entryDate: '2026-01-15',
    fuelType: 'Gasolina', transmission: 'Automática',
    description: 'Ford Bronco Sport para la aventura.'
  },
  {
    id: 'c12', brand: 'Jeep', model: 'Compass', version: 'LATITUDE', year: 2023,
    price: 510000, km: 27000, status: 'DISPONIBLE',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&auto=format',
    color: 'Azul Hydro', vin: '046283', entryDate: '2026-03-01',
    fuelType: 'Gasolina', transmission: 'Automática',
    description: 'Jeep Compass Latitude 4x2. Aventura y confort en uno.'
  },
];

export const MOCK_CLIENTS: Client[] = [
  { id: 'cl1', name: 'Roberto Sánchez Vega', phone: '6699123456', email: 'roberto@gmail.com', status: 'NEGOCIACION', assignedTo: 'u3', interestedIn: 'c3', budget: 450000, notes: 'Busca SUV familiar, tiene 2 hijos. Muy interesado en Kia Seltos.', createdAt: '2026-04-10', source: 'Instagram' },
  { id: 'cl2', name: 'Laura Medina Torres', phone: '6691234567', email: 'laura.medina@gmail.com', status: 'SEGUIMIENTO', assignedTo: 'u3', interestedIn: 'c1', budget: 520000, notes: 'Quiere financiamiento. Primera compra de auto nuevo.', createdAt: '2026-04-12', source: 'WhatsApp' },
  { id: 'cl3', name: 'Carlos Figueroa López', phone: '6692345678', email: 'cfigueroa@hotmail.com', status: 'NUEVO', assignedTo: 'u3', budget: 300000, notes: 'Viene referido por Roberto Sánchez. Busca sedan económico.', createdAt: '2026-04-14', source: 'Referido' },
  { id: 'cl4', name: 'Ana Patricia Guerrero', phone: '6693456789', email: 'anapg@outlook.com', status: 'CERRADO', assignedTo: 'u3', interestedIn: 'c11', budget: 490000, notes: 'Compró Bronco Sport. Muy satisfecha.', createdAt: '2026-03-20', source: 'Facebook' },
  { id: 'cl5', name: 'Jorge Alberto Pinto', phone: '6694567890', email: 'jorgepinto@gmail.com', status: 'NEGOCIACION', assignedTo: 'u3', interestedIn: 'c10', budget: 600000, notes: 'Empresario. Busca algo premium. Tiene trade-in de Mazda 3.', createdAt: '2026-04-08', source: 'Página web' },
  { id: 'cl6', name: 'Valeria Romero Cruz', phone: '6695678901', email: 'vale.romero@gmail.com', status: 'SEGUIMIENTO', assignedTo: 'u3', interestedIn: 'c5', budget: 270000, notes: 'Estudiante universitaria. Primer auto. Papá ayuda con el enganche.', createdAt: '2026-04-13', source: 'Instagram' },
  { id: 'cl7', name: 'Fernando Ochoa Ríos', phone: '6696789012', email: 'fochoa@empresa.com', status: 'PERDIDO', assignedTo: 'u3', budget: 400000, notes: 'Se fue a otra agencia por precio. Seguimiento en 3 meses.', createdAt: '2026-03-25', source: 'Google' },
  { id: 'cl8', name: 'Marcela Inzunza Beltrán', phone: '6697890123', email: 'marce.inzunza@gmail.com', status: 'NUEVO', assignedTo: 'u3', budget: 420000, notes: 'Llamó hoy. Quiere HR-V o Seltos.', createdAt: '2026-04-15', source: 'WhatsApp' },
  { id: 'cl9', name: 'Héctor Dávila Cuen', phone: '6698901234', email: 'hdavila@negocio.mx', status: 'NEGOCIACION', assignedTo: 'u3', interestedIn: 'c9', budget: 450000, notes: 'Necesita factura a nombre de empresa. Tax deductible.', createdAt: '2026-04-07', source: 'Facebook' },
  { id: 'cl10', name: 'Sofía Corrales Meza', phone: '6699012345', email: 'sofia.c@gmail.com', status: 'SEGUIMIENTO', assignedTo: 'u3', interestedIn: 'c4', budget: 380000, notes: 'Muy indecisa entre K3 y Corolla. Requiere segunda cita.', createdAt: '2026-04-11', source: 'Instagram' },
];

export const MOCK_SALES: Sale[] = [
  {
    id: 's1', clientId: 'cl4', carId: 'c11', sellerId: 'u3',
    finalPrice: 485000, saleDate: '2026-03-28', paymentMethod: 'CONTADO',
    status: 'COMPLETADA', commission: 9700, notes: 'Pago de contado. Entrega inmediata.'
  },
  {
    id: 's2', clientId: 'cl4', carId: 'c7', sellerId: 'u3',
    finalPrice: 390000, saleDate: '2026-04-02', paymentMethod: 'CREDITO',
    status: 'PENDIENTE_DOCS', commission: 7800, notes: 'Crédito en proceso. Falta firma de contrato.'
  },
];

export const MOCK_WORKSHOP: WorkshopItem[] = [
  {
    id: 'w1', carId: 'c7', assignedTo: 'u4', startDate: '2026-04-10',
    checklist: { motor: true, frenos: true, estetica: false, llantas: true, electricidad: true, ac: false, documentacion: false },
    cost: 8500, notes: 'Falta pintar cofre menor. AC revisar gas refrigerante.', status: 'EN_PROCESO'
  },
  {
    id: 'w2', carId: 'c12', assignedTo: 'u4', startDate: '2026-04-14',
    checklist: { motor: false, frenos: false, estetica: false, llantas: false, electricidad: false, ac: false, documentacion: false },
    cost: 0, notes: 'Recién ingresado. En evaluación inicial.', status: 'PENDIENTE'
  },
];

export const SALES_MONTHLY_DATA = [
  { mes: 'Nov', ventas: 3, monto: 1250000 },
  { mes: 'Dic', ventas: 5, monto: 2100000 },
  { mes: 'Ene', ventas: 4, monto: 1800000 },
  { mes: 'Feb', ventas: 6, monto: 2400000 },
  { mes: 'Mar', ventas: 7, monto: 3150000 },
  { mes: 'Abr', ventas: 4, monto: 1960000 },
];
